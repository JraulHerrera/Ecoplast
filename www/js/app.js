// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('app', ['ngRoute','ngResource','ionic','ngCordova'])

function routeProvider($routeProvider) {
    $routeProvider.
        when('/as', {
            controller: '',
            templateUrl: 'templates/ecoplast/login.html'
        }).

        when('/', {
            controller: 'HomeCtrl',
            templateUrl: 'templates/ecoplast/movimientos.html'
        }).

        when('/movimientos', {
            controller: 'HomeCtrl',
            templateUrl: 'templates/ecoplast/movimientos.html'
        }).

        when('/historial', {
            controller: '',
            templateUrl: 'templates/ecoplast/historial.html'
        }).
        
        when('/sincronizar', {
            controller: '',
            templateUrl: 'templates/ecoplast/sincronizar.html'
        }).

        otherwise({
            redirectTo: '/'
        });
}
app.config(routeProvider);


/*.config(function($routeProvider){
  $routeProvider
  .when("/sdasd",
    {
      templateUrl: "templates/list.html",
      controller: "HomeCtrl",
    }
  );
})*/
//app.config(['$routeProvider',function($routeProvider)
/*.config(function(configRoutesProvider,$routeProvider)
{
  $routeProvider.when("/",
  {
    templateUrl: "templates/list.html",
    controller: "HomeCtrl"
  })
  .when('/edit/:id',{
    templateUrl: 'templates/list.html',
    controller: 'EditCtrl'
  })
  .when('/create',{
    templateUrl: 'templates/list.html',
    controller: 'CreateCtrl'
  })
  .otherwise({redirectTo:"/home"});
})*/
//}]);


app.controller('HomeCtrl',['$scope','ecoplast','$route',function($scope,ecoplast,$route){
 ecoplast.get(function(data)
 {
  $scope.ecoplast = data.scoplast;
 })
}])

app.controller('newempresaCtrl',['$scope','ecoplast','$route',function($scope,ecoplast,$route){
 
}])


app.controller('EditCtrl',['$scope','ecoplast','$routeParams',function($scope,$routeParams){
  
}])

app.controller('CreateCtrl',['$scope','ecoplast',function($scope){
  
}])

app.factory('ecoplast',function($resource){
  return $resource("http://localhost:8000/ecoplast/:id",{id:"@_id"},{
    update:{method:"PUT", params:{id: "@id"}}
  })
})

app.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {

 // Triggered on a button click, or some other target
 $scope.showPopup = function() {
   $scope.data = {}

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="password" ng-model="data.wifi">',
     title: 'Enter Wi-Fi Password',
     subTitle: 'Please use normal things',
     scope: $scope,
     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.data.wifi) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
             return $scope.data.wifi;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
   $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
   }, 3000);
  };

   // An alert dialog
   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: '',
       template: 'Movimiento registrado con éxito'
     });
     alertPopup.then(function(res) {
       console.log('Thank you');
     });
   };
});


app.controller('lectorController', function($scope, $cordovaBarcodeScanner){
    $scope.leerCodigo = function(){
      $cordovaBarcodeScanner.scan().then( function(imgenEscaneada){
        alert(imgenEscaneada.text);
      }, function(error){
        alert("Ha ocurrido un error: :p"+ error);
      });
    }


  });
