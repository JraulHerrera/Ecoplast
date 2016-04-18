angular.module('starter.services', ['ionic','ngCordova'])
//servicio para login, verifica que esten correctos lo datos y regresa al controlador

.service('LoginService', function($q,$http) {
    return {
        loginUser: function(uuid, pass) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var params ={
                  name: uuid,
                  pass: pass
            };
            var usuario;            
             $http({
              url:'http://itsolution.mx/login',
              method:'POST',
              data:params
            })
            .success(function (data, status, headers, config) {
                if(data.length > 0 ){
                    if (uuid == data[0].usuario && pass== data[0].password) {
                        deferred.resolve('Bienvenido ' + data[0].nombre_empleado);
                    } else {
                        deferred.reject('Acceso no valido');
                    }
                }
                else{
                    deferred.reject('Acceso no valido');
                }                   
            },
            function(error){
                   deferred.reject('Acceso no valido');
            });

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
