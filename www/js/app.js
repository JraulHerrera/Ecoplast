
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var db =null;

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(window.cordova  && window.SQLitePlugin)
      { 
        db = $cordovaSQLite.openDB('sincronizar.db', -1);

      }
      else
      {
       db = window.openDatabase("sincronizar.db", "1.0", "sincronizar", -1);
      }
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS rastreo (id integer primary key, id_embarque integer, fecha text, firma text, entrada integer, usuario_id text, ubicaciones_id integer, placas text)");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (id integer primary key, usuario text, nombre text, contrasena text)");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS embarque (id integer primary key, usuario_id integer, materiales integer, ubicaciones_id integer, peso integer, fechalocal text, fecha text, codigocontrol text)");

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
    url: '/movimientos',
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
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
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


