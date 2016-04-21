
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var dbname='sincronizarEco.db'; 
var db =null;
var nombredeusuario=null;
 var usrActual;
angular.module('starter', ['ionic','ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $cordovaSQLite, $ionicPopup, $http) {
  $ionicPlatform.ready(function() {     
            
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
     if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({name: dbname, location: 'default'});
        } else {
            db = window.openDatabase(dbname, "1.0", "sincronizar", 900000);
        }
     // $cordovaSQLite.execute(db,"DROP TABLE user");
      //$cordovaSQLite.execute(db,"DROP TABLE rastreo");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS rastreo (codigoControl text, claveMaterial text, nombreMaterial text, peso text, fecha text, idUbicacion text, nombreUbicacion text, entradaSalida text, matricula text,  autorizadopo text, firma text, usuarioactual text)");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (usuario text primary key, contrasena text)");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS embarque (id integer primary key, usuario_id integer, materiales integer, ubicaciones_id integer, peso integer, fechalocal text, fecha text, codigocontrol text)");
     
       $http({
              url:'http://itsolution.mx/login/getallusers',
              method:'GET'
            })
        .success(function(data){ 
          for (var i =0; i <data.length; i++) {  

              var query = "INSERT INTO user (usuario,contrasena) VALUES (?,?)";
            
              $cordovaSQLite.execute(db, query, [data[i].usuario, data[i].password]).then(function(res) 
              {
                //alert("INSERT ID -> " + res.insertId);
                //console.log("INSERT ID -> " + res.insertId);
              },function (err) 
                {
                  //alert('rer'+ err);
                });
          }       
            

        });


     });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
//estado para login
   .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })


  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'

  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/movimientos:name',
    views: {
      'movi-vista': {
        templateUrl: 'templates/movimientos.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/historial',
      views: {
        'histo-vista': {
          templateUrl: 'templates/historial.html',
          controller: 'ChatsCtrl'
        }
      }
    })


  .state('tab.account', {
    url: '/sicronizacion',
    views: {
      'sincro-vista': {
        templateUrl: 'templates/sincronizar.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});


