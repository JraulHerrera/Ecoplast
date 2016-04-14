angular.module('starter.services', [])
//servicio para login, verifica que esten correctos lo datos y regresa al controlador

.service('LoginService', function($q,$http) {
            var nombre="";
            var pass="";

    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var nombre="";
            var pass="";
           $http.get("http://itsolution.mx/ecoplast/public/RESTService/login/"+name+"/"+pw)
            .success(function(data){
                     var length = data.length;
                      for ( i=0; i < length; i++) {  
                        nombre = data[i].usuario;
                        pass = data[i].password;
                      };
                   
              if (name==nombre && pw==pass) {
                  deferred.resolve('Welcome ' + name + '!');
              } 

              else {
                  deferred.reject('Usuario incorrecto.');
              }

            })

             promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }

              promise.error = function(fn){
                promise.then(null, fn);
                return promise;
            }


            return promise;
           
           
            
        }
    }
})


.factory('Chats', function() {

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

