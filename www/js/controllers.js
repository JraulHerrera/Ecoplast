var db =null;

angular.module('starter.controllers', ['ionic','ngCordova'])
    .run(function($ionicPlatform, $cordovaSQLite) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
            db = $cordovaSQLite.openDB("sincronizar.db");
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS rastreo (id integer primary key, id_embarque integer, fecha text, firma text, entrada integer, usuario_id text, ubicaciones integer, placas text)");
        })
    })



//controlador de login
.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};
 
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('tab.dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error de ingreso!',
                template: 'porfavor verifique sus datos!',
                buttons:[{
                type:"button-balanced",
                text:"<b>OK</b>",
                }]
            });
        });
    }
})
//scanner
  .controller('DashCtrl', function($scope, $cordovaBarcodeScanner, $ionicPopup,$http ,$ionicModal){
        $scope.movimientosescaneado={};
        $scope.movimientos=[];
        $scope.movimientossincronizar={};
        $scope.sincronizacion=[];
        

        $scope.leerCodigo = function(){
          $cordovaBarcodeScanner.scan().then( function(imgenEscaneada)
          {
            var alert= imgenEscaneada.text;
            var texto=alert;
            var arregloDeSubCadenas = texto.split('|');
          if(arregloDeSubCadenas[0]!="Undefined" && arregloDeSubCadenas[0]=="undefined"||arregloDeSubCadenas[0]!="")
          {
            var codigoControl='"'+arregloDeSubCadenas[0]+'"';
            var clvMaterial='"'+arregloDeSubCadenas[1]+'"';
            var nombreMaterial='"'+arregloDeSubCadenas[2]+'"';
            var peso='"'+arregloDeSubCadenas[3]+'"';
            var usuario='"'+arregloDeSubCadenas[4]+'"';
            var nombreUsuario='"'+arregloDeSubCadenas[5]+'"';
            var fecha='"'+arregloDeSubCadenas[6]+'"';
            var idUbicacion='"'+arregloDeSubCadenas[7]+'"';
            var nombreUbicacion='"'+arregloDeSubCadenas[8]+'"';
            var registro = ('{"CodigoControl":'+codigoControl+',"ClaveMaterial":'+clvMaterial+',"NombreMaterial":'+nombreMaterial+',"Peso":'+peso+',"Usuario":'+usuario+',"NombreUsuario":'+nombreUsuario+',"Fecha":'+fecha+',"IdUbicacion":'+idUbicacion+',"NombreUbicacion":'+nombreUbicacion+'}');
            var registro = angular.fromJson(registro);

            $scope.movimientos.push(registro);
            $scope.movimientosescaneado={};
            registro="";
          }
            else
            {
              $scope.movimientosescaneado={};
              registro="";
            }
              
          }, function(error){
              alert("Ha ocurrido un error:"+ error);
      });
    }
//mensaje de movimientos
var showingText="Movimiento registrado con éxito";

$scope.info=function(){
  var alert = $ionicPopup.alert({
  title:'',
  template:showingText,
  buttons: [
    {
      text:"<b>Continuar</b>",
      type:"button-balanced",
      onTap: function(e){
      showingText=alert;

      return true;   
    }
    },
    ]

})
}
//

    var canvas = document.getElementById('signatureCanvas');
    var signaturePad = new SignaturePad(canvas);
 
    $scope.clearCanvas = function() {
        signaturePad.clear();
    }
 
    $scope.saveCanvas = function() {
        var sigImg = signaturePad.toDataURL();
        
        //guarda la imagen.
        $scope.signature = sigImg;
    }

//otros
    var canvas = null,
      ratio = 1.0;

    
        $scope.signature = null;
        $scope.signaturePadModel = {};

        $ionicModal.fromTemplateUrl('firma-modal.html', {
          animation: 'slide-in-up',
          scope: $scope,
        }).then(function(modal) {
          $scope.signatureModal = modal;
        });

        $scope.$on('$destroy', function () {
          $scope.signatureModal.remove();
        });

        $scope.openSignatureModal = function () {
          $scope.signatureModal.show();
          canvas = angular.element($scope.signatureModal.modalEl).find('canvas')[0];

          $scope.signaturePad = new SignaturePad(canvas, {
            backgroundColor: '#FFF',
            minWidth: 1,
            maxWidth: 1.5,
            dotSize: 3,
            penColor: 'rgb(66, 133, 244)',
            onEnd: function () {
              $scope.signature = $scope.signaturePad.toDataURL();
            }
          });

          if ($scope.signature) {
            $scope.signaturePad.fromDataURL($scope.signature);
          }
          $scope.resizeCanvas();
        };

        $scope.resizeCanvas = function () {
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext('2d').scale(ratio, ratio);          
        };

        $scope.clear = function () {
          $scope.signaturePadModel.signatureConfirm = false;
          $scope.signaturePad.clear();
          $scope.signature = null;
        };

        $scope.saveCanva = function () {
          $scope.signaturePadModel = {};
          
          $scope.signatureModal.hide();
        };

    $scope.saveCanvas = function() {
        var sigImg = signaturePad.toDataURL();
          $scope.signature = sigImg;
           $scope.signatureModal.hide();
    };
   //registro
   $scope.registrar = function(){
          var ccontrol="";
          var cmaterial="";
          var length = $scope.movimientos.length;
          
                      for ( i=0; i < length; i++) {
                        $http.get('http://localhost:8000/RESTService/movimientos/',{
                          params: {
                             "codigoControl": $scope.movimientos[i].CodigoControl,
                             "claveMaterial": $scope.movimientos[i].ClaveMaterial,
                             "nombreMaterial": $scope.movimientos[i].NombreMaterial,
                             "peso": $scope.movimientos[i].Peso,
                             "usuario": $scope.movimientos[i].usuario,
                             "nombreUsuario": $scope.movimientos[i].nombreUsuario,
                             "fecha": $scope.movimientos[i].Fecha,
                             "idUbicacion": $scope.movimientos[i].IdUbicacion,
                             "nombreUbicacion":$scope.movimientos[i].NombreUbicacion
                          }
                        })
                          .success(function(data){
                            alert("completado");
                          })

                          .error(function(data){                          
                          /* 
                            console.log($scope.movimientos[i-1].CodigoControl);
                                alert($scope.movimientos[i-1].CodigoControl);*/
                               
                                var codigoControl='"'+$scope.movimientos[i-1].CodigoControl+'"';
                                var clvMaterial='"'+$scope.movimientos[i-1].ClaveMaterial+'"';
                                var nombreMaterial='"'+$scope.movimientos[i-1].NombreMaterial+'"';
                                var peso='"'+$scope.movimientos[i-1]+'"';
                                var usuario='"'+$scope.movimientos[i-1].usuario+'"';
                                var nombreUsuario='"'+$scope.movimientos[i-1].nombreUsuario+'"';
                                var fecha='"'+$scope.movimientos[i-1].Fecha+'"';
                                var idUbicacion='"'+$scope.movimientos[i-1].IdUbicacion+'"';
                                var nombreUbicacion='"'+$scope.movimientos[i-1].NombreUbicacion+'"';
                                var registro = ('{"CodigoControl":'+codigoControl+',"ClaveMaterial":'+clvMaterial+',"NombreMaterial":'+nombreMaterial+',"Peso":'+peso+',"Usuario":'+usuario+',"NombreUsuario":'+nombreUsuario+',"Fecha":'+fecha+',"IdUbicacion":'+idUbicacion+',"NombreUbicacion":'+nombreUbicacion+'}');
                                var registro = angular.fromJson(registro);

                                $scope.sincronizacion.push(registro);
                                $scope.movimientossincronizar={};
                                registro="";


                          });
                      };
      }
  

  
  })


.controller('ChatsCtrl', function($scope, Chats ,$ionicPopup) {
  var showingText="Movimiento registrado con éxito";

$scope.info2=function(){
  var alert = $ionicPopup.alert({
  title:'',
  template:showingText,
  buttons: [
    {
      text:"<b>Continuar</b>",
      type:"button-balanced",
      onTap: function(e){
      showingText=alert;

      return true;   
    }
    },
    ]

})
}
//historial ws
var historiales="";
   $http.get("http://localhost:8000/RESTService/historial")
            .success(function(data){
                $scope.historiales = data;
            })


  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
  
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

//controlador para sincronizacion 

.controller('AccountCtrl', function($scope, $cordovaSQLite) {

    $scope.insert = function(id, id_embarque, fecha, firma, entrada, usuario_id, ubicaciones_id, placas) {
        var query = "INSERT INTO rastreo (id, id_embarque, fecha, firma, entrada, usuario_id, ubicaciones_id, placas) VALUES (?,?,?,?,?,?,?,?)";
         alert(query);
        $cordovaSQLite.execute(db, query, [id, id_embarque, fecha, firma, entrada, usuario_id, ubicaciones_id, placas]).then(function(res) {
            alert("INSERT ID -> " + res.insertId);
        }, function (err) {
            console.error(err);
        });
    }
 
    $scope.select = function(id) {
        var query = "SELECT  materiales_id FROM rastreo WHERE id = ?";
        $cordovaSQLite.execute(db, query, [id]).then(function(res) {
            if(res.rows.length > 0) {
                alert("SELECTED -> " + res.rows.item(0).id_embarque + " " + res.rows.item(0).usuario_id);
            } else {
                alert("No results found");
            }
        }, function (err) {
            alert(err);
        });
    }
 

});



