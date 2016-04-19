angular.module('starter.services', ['ionic','ngCordova'])
//servicio para login, verifica que esten correctos lo datos y regresa al controlador

.service('LoginService', function($q,$http,$cordovaSQLite,$state, $ionicPopup) {
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
            }).success(function (data, status, headers, config) {
                
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
            }).error(function(data){
                    
                    /****************************************************/
                    
                    //$scope.select = function()
                    //{
                        var query = "SELECT * FROM user WHERE usuario=? and contrasena=?";
                        $cordovaSQLite.execute(db, query, [uuid, pass]).then(function(data) {
                            //console.log("usuario: "+data.rows.item(0).usuario);
                            //console.log("contrasena: "+data.rows.item(0).contrasena);
                            if(data.rows.length>0)
                            {
                                $state.go('tab.dash',{name: ''});
                            }

                            else
                            {                              
                                var alertPopup = $ionicPopup.alert({
                                title: 'Error de ingreso!',
                                template: 'porfavor verifique sus datos!',
                                buttons:[{
                                type:"button-balanced",
                                text:"<b>OK</b>",
                                }]
                                });

                            }
                           //console.log(JSON.stringify(data));
                        }, function (err) {
                          //console.error(JSON.stringify(err));
                        });

                    /****************************************************/









            });

            promise.success = function(fn) {
                //console.log("fn desde error: "+fn);   
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
           // console.log("fn desde error: "+fn);                 
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})






