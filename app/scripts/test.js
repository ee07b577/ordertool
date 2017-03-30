    var config4wilddog = {
        authDomain: "ordertool.wilddog.com",
        syncURL: "https://ordertool.wilddogio.com"
    };

    wilddog.initializeApp(config4wilddog);
    var sync = wilddog.sync()
    var auth = wilddog.auth()

    var app = angular.module('order', ['ngRoute']);

    app.config(['$locationProvider', function($locationProvider) {
            $locationProvider.hashPrefix('');
        }])
        .config(function($routeProvider) {
            $routeProvider
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
                .otherwise({
                    redirctTo: '/userinfo'
                })
        })
        .controller('authCtrl', function($scope, $rootScope) {

            $scope.userid = ''
            $scope.logged = false;

            $scope.createUser = function() {
                auth.createUserWithPhoneAndPassword($scope.username, $scope.password)
                    .then(function(user) {
                        userid = user.uid;
                        $scope.$apply(function() {
                            $scope.userid = user.uid
                            $scope.logged = true;
                        })
                    })
            }

            $scope.signin = function() {
                auth.signInWithPhoneAndPassword($scope.username, $scope.password)
                    .then(function(user) {
                        $scope.userid = user.uid
                        $scope.$apply(function() {
                            $scope.userid = user.uid
                            $scope.logged = true;
                        })
                    })

            }

            $scope.logout = function() {
                auth.signOut().then(function() {
                    console.log('logout!')
                    $scope.$apply(function() {
                        $scope.logged = false;
                    })
                })
            }
        })
        .controller('infoCtrl', function($scope, $http) {

            $http({
                method: 'get',
                url: './config/menu.json?shff',
            }).then(function successCallback(response) {
                $scope.menu = response.data;
                sync.ref('menu').set(response.data);
            }, function errorCallback(res) {
                console.log(res)
            });


            $scope.levelSelect = function(level) {
                // console.log(level)
                // console.log($scope.level)
            }

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
