    var config4wilddog = {
        authDomain: "ordertool.wilddog.com",
        syncURL: "https://ordertool.wilddogio.com"
    };

    wilddog.initializeApp(config4wilddog);
    var sync = wilddog.sync()
    var auth = wilddog.auth()

    var app = angular.module('ordertool', ['ngRoute']);
    app
        .config(['$locationProvider', function($locationProvider) {
            $locationProvider.hashPrefix('');
        }])
        .config(function($routeProvider) {
            $routeProvider
                .when('/signin', {
                    templateUrl: './partials/signin.html',
                    controller: 'signinCtrl'
                })
                .when('/signup', {
                    templateUrl: './partials/signup.html',
                    controller: 'signupCtrl'
                })
                .when('/userinfo', {
                    templateUrl: './partials/userinfo.html',
                    controller: 'infoCtrl'
                })
                .when('/order', {
                    templateUrl: './partials/order.html',
                    controller: 'orderCtrl'

                })
                .when('/history', {
                    templateUrl: './partials/history.html',
                    controller: 'historyCtrl'
                })
                .when('/caculator', {
                    templateUrl: './partials/caculator.html',
                    controller: 'caculatorCtrl'
                })
                .otherwise({
                    redirctTo: '/'
                })
        })
        .controller('ordertoolCtrl', function($scope, $location, authService) {

            $scope.logged = false;

            $scope.logged = function() {
                authService.logout()
            }

            $scope.$on('authStatusChanged', function() {
                if (!$scope.logged) {
                    // TODO 登录失效，则刷新页面
                    // $location.url('/');

                }
                $scope.$broadcast('authStatusChanged');
            })

            $scope.pricelist = [{ 'zh': '2' }, { 'zh': 'sfs' }]

            sync.ref('/pricelist').on('value', function(snapshot) {
                $scope.$apply(function() {
                    $scope.pricelist = snapshot.val();
                    console.log($scope.pricelist)
                })

            })

        })
        .controller('signinCtrl', function($scope, authService) {
            $scope.signin = function() {
                authService.signin($scope.username, $scope.password)
            }
        })
        .controller('signupCtrl', function($scope, authService) {
            // todo : 验证 密码 和 确认密码 是一样的
            $scope.signin = authService.signup($scope.username, $scope.password)
        })
        .controller('infoCtrl', function($scope) {

            $scope.pricelist = [{ 'zh': '2' }, { 'zh': 'sfs' }]
            console.log($scope.pricelist)
            $scope.saveInfo = function() {
                var userinfo = {
                    "leader": $scope.leader,
                    "source": $scope.source,
                    "name": $scope.name,
                    "code": $scope.code,
                    "level": $scope.level,
                    "tel": $scope.tel,
                    "wechat": $scope.wechat,
                    "addr": $scope.addr
                }

                sync.ref('users').ref(userid).set(userinfo);

            }
        })
        .controller('orderCtrl', function($scope, $rootScope) {

        })
        .factory('authService', function($http, $rootScope) {

            var authService = {}

            authService.signin = function(email, password) {

                auth.signInWithPhoneAndPassword(email, password)
                    .then(function(user) {
                        $rootScope.$apply(function() {
                            $rootScope.userid = user.uid;
                            $rootScope.logged = true;
                        })
                    }, function(err) {
                        alert('登录失败')
                        console.log(err)
                    })


            }
            authService.signup = function(email, password) {

                auth.createUserWithPhoneAndPassword(email, password)
                    .then(function(user) {
                        $rootScope.$apply(function() {
                            $rootScope.userid = user.uid;
                            $rootScope.logged = true;
                        })
                        alert('注册成功')
                    }, function(err) {
                        console.log(err)
                    })


            }

            authService.logout = function() {
                auth.signOut()
                    .then(function() {
                        console.log('logout!')
                        $rootScope.$apply(function() {
                            $rootScope.logged = false;
                        })
                    }, function(err) {
                        console.log(err)
                    })
            }

            authService.checkStatus = function() {
                return $rootScope.logged;
            }

            var stopListen = auth.onAuthStateChanged(function(user) {
                console.log('auth state changed ->', user);
                if (user) {
                    $rootScope.logged = true;
                    alert('登录成功')
                } else {
                    $rootScope.logged = false;
                }

            });

            return authService;


        })

    // .controller('formCtrl', function($scope, $http) {

    //     //读取本地设置 TODO: 从野狗服务器读取数据
    //     $scope.levelSelected = false;
    //     $scope.generated = false;
    //     $scope.addItem = function(item) {
    //         $scope.orderlist.push(item)
    //     }

    //     $scope.levelChange = function(level) {
    //         $scope.pricelist = level.list;
    //         $scope.levelSelected = true;
    //     }

    //     $scope.cost = 0;
    //     $scope.number = 0;
    //     $scope.caculate = function() {
    //         var cost = 0;
    //         var number = 0;
    //         for (var i = 0, len = $scope.level.list.length; i < len; i++) {
    //             var order = $scope.level.list[i];
    //             cost += order.cost * order.quantity;
    //             number += order.quantity

    //         }
    //         $scope.cost = cost;
    //         $scope.number = number
    //     }

    //     $scope.generateOrder = function() {
    //         $scope.generated = true;
    //     }

    // })
