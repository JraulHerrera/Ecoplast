angular.module('starter.services', [])
//servicio para login, verifica que esten correctos lo datos y regresa al controlador

.service('LoginService', function($q,$http,$scope,$log) {

/* $http.get('http://localhost:8000/ecoplast').success(function(response){
    chats = response.chats;
  });*/
    var nombre="";
    var password="";
    /*
    $http.get('http://localhost:8000/ecoplast')
    .then(function(response)
    {
      nombre = response.data;
    });*/
 $http.get('http://localhost:8000/ecoplast').
    success(function(data) {
      $scope.form = data.post;
    });

    return {
        loginUser: function(name, pw) {

/*
$http.get('http://localhost:8000/ecoplast').success(function(response){
    chats = response.chats;
        $scope.usuario=$http.get("http://localhost:8000/RESTService/login/"+name+"/"+pw)
            .then(function(response){
              $scope.usuario=response.data;
              $log.info(response);
            })*/

            var response = JSON.parse(json);
            console.log(response[0].res);
            if (response[0].res==1){
            //lo que deseas hacer
            }

          var config={
          method:"GET",
          url:"http://localhost:8000/RESTService/login/"+name+"/"+pw
          }
   
      var response=$http(config);
   
             
      response.success(function(data, status, headers, config) {
        $scope.seguro=data;

      })

            var deferred = $q.defer();
            var promise = deferred.promise;
 
            if (name == nombre && pw == password) {
                deferred.resolve('Welcome ' + name + name);
            } else {
                deferred.reject('Usuario incorrecto.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})


.factory('Chats', function() {

 
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  /*
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];*/

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

