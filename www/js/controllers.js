var entradaSalida="1";
var signature=null;
var sigImg=null;
var registroCompletado=0;

angular.module('starter.controllers', ['ionic','ngCordova',"starter.services"])
  
//controlador de login
.controller('LoginCtrl', function($ionicPlatform, $scope, LoginService, $ionicPopup,  $cordovaNetwork, $state, $rootScope) {
    $scope.data = {};
    $scope.login = function() {
      nombredeusuario=$scope.data.username;
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
             $state.go('tab.dash',{name: $scope.data.username});
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
 .controller('DashCtrl', function($scope,$state, $cordovaBarcodeScanner, $ionicPopup,$http ,$ionicModal){
        $scope.data = {};
        $scope.recepcion="1";
        $scope.matriculaVehiculo="matricula";
        $scope.matriculaVehiculos="vehiculos";

        $scope.autorizadopor;      

      $scope.nombredeusuario=$state.params.name;
     
      var nm;
      var pss;

         $scope.actualizaentrada=function() {
          entradaSalida="1";
        }

        $scope.actualizasalida=function(){
          entradaSalida="0";
        }




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
         var mes;
          var dia;
          var hora;
          var minutos;
          var segundos;

        var d = new Date();
        var anno=d.getFullYear();
        

        if((d.getMonth()+1)<10)
        {
          mes='0'+(d.getMonth()+1);
        }else{mes=(d.getMonth()+1);}

        if(d.getDate()<10){
          dia='0'+d.getDate();
        }else{dia=d.getDate();}

        if(d.getHours()<10)
        {
          hora='0'+d.getHours();
        }else{hora=d.getHours();}

        if(d.getMinutes()<10)
        {
          minutos='0'+d.getMinutes();
        }else{minutos=d.getMinutes();}

        if(d.getSeconds()<10){
          segundos='0'+(d.getSeconds());
        }else{
          segundos=d.getSeconds();
        }

        
        var fecha=(anno+'/'+mes+'/'+dia+' '+hora+':'+minutos+':'+segundos);
        
            var codigoControl='"'+arregloDeSubCadenas[0]+'"';
            var clvMaterial='"'+arregloDeSubCadenas[1]+'"';
            var nombreMaterial='"'+arregloDeSubCadenas[2]+'"';
            var peso='"'+arregloDeSubCadenas[3]+'"';
            var usuario='"'+arregloDeSubCadenas[4]+'"';
            var nombreUsuario='"'+arregloDeSubCadenas[5]+'"';
            var fecha='"'+arregloDeSubCadenas[6]+'"';
            var idUbicacion='"'+arregloDeSubCadenas[7]+'"';
            var nombreUbicacion='"'+arregloDeSubCadenas[8]+'"';
            var entradaySalida='"'+$scope.entradaSalida+'"';
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
  var d = new Date();
        var hora=('Fecha: '+d.getDate()+'Dia de la semana: '+d.getDay()+'Mes: '+d.getMonth()+'Año: '+d.getFullYear()+'Hora: '+d.getHours()+'Hora UTC: '+d.getUTCHours()+'Minutos: '+d.getMinutes()+'Segundos: '+d.getSeconds());
        $scope.matriculaVehiculo=hora;
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
 
   

//firma
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
            penColor: 'rgb(66, 133, 244)'
            
          });

          if ($scope.signature) {
            $scope.signaturePad.fromDataURL($scope.signature);
          }
          $scope.resizeCanvas();
        };

        $scope.resizeCanvas = function () {
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = 178;
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
           
         sigImg = signaturePad.toDataURL();
          $scope.signature = sigImg;

           $scope.signatureModal.hide();
           $scope.signature = null;
    };
//convertir la imagen 


   //registro
    var usr=$state.params.name;

   $scope.registrar = function(){
    var usertemp;
    var completado=0;
    var conexion=1;
        $http.get("http://54.218.11.27/RESTService/login/"+usr)
        .success(function(data){

                     var length = data.length;
                 
                     var json=data;
                      for ( i=0; i < json.length; i++) {  
                        usertemp = json[i].perfil;    
                                       
                      };


          var ccontrol="";
          var cmaterial="";
          var length = $scope.movimientos.length; 
          var c=0;
                      
                      for ( i=0; i < length; i++){                       
                          $http.get('http://54.218.11.27/RESTService/movimientos/',{
                          params: {
                             "codigoControl": $scope.movimientos[i].CodigoControl,
                             "claveMaterial": $scope.movimientos[i].ClaveMaterial,
                             "nombreMaterial": $scope.movimientos[i].NombreMaterial,
                             "peso": $scope.movimientos[i].Peso,
                             "usuario": $scope.movimientos[i].usuario,
                             "nombreUsuario": usertemp,
                             "fecha": $scope.movimientos[i].Fecha,
                             "idUbicacion": $scope.movimientos[i].IdUbicacion,
                             "nombreUbicacion":$scope.movimientos[i].NombreUbicacion,
                             "entradaSalida":entradaSalida,
                             "matricula":$scope.data.matriculaVehiculo,
                             "autorizadopor":$scope.data.autorizadopor,
                             "firma":sigImg,
                             "usuarioactual":$state.params.name
                          }
                        }).success(function(data,status){
                          console.log("valor de data: "+data);
                                    c++;
                                      if(c==length && data=="1001")
                                      {
                                        var alert = $ionicPopup.alert({
                                        title:'Movimiento Registrado con éxito<br><br><br>',
                                        template:'',
                                        buttons: [
                                          {
                                            text:"<b>Aceptar</b>",
                                            type:"button-balanced",
                                            onTap: function(e){
                                            showingText=alert;
                                            return "";   
                                          }
                                          },
                                          ]

                                        })


                                        $scope.movimientos=[];
                                        $scope.data.matriculaVehiculo="";
                                        $scope.data.autorizadopor="";
                                        entradaSalida="1";
                                      }

                                      if(c==length && data!="1001")
                                      {
                                           var alert = $ionicPopup.alert({
                                            title:'Movimiento no registrado<br><br><br>',
                                            template:'',
                                            buttons: [
                                              {
                                                text:"<b>Aceptar</b>",
                                                type:"button-balanced",
                                                onTap: function(e){
                                                showingText=alert;
                                                return "";   
                                              }
                                              },
                                              ]

                                            })


                                            $scope.movimientos=[];
                                            $scope.data.matriculaVehiculo="";
                                            $scope.data.autorizadopor="";
                                            entradaSalida="1";
                                      }
                          }).error(function(data, status) {
                              registroCompletado=0;
                             })


                          .error(function(data){                          
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
                                completado=0;
                          });
                      }
                })//cierre success http usuario
        .error(function (data, status) {

              var alert = $ionicPopup.alert({
                          title:'Movimiento incompleto, datos pendientes de sincronizar<br><br><br>',
                          template:'',
                          buttons: [
                          {
                          text:"<b>Aceptar</b>",
                          type:"button-balanced",
                          onTap: function(e){
                          showingText=alert;
                            return "";   
                          }
                             },
                            ]

                    })
               entradaSalida="1";
            })

      }

  //movimientos detalle
    $scope.mostrarInformacion=function(movimiento){
      console.log(movimiento);
       var alert = $ionicPopup.alert({
         cssClass: 'yourclass',
              title:'<p align="left">Detalle de embarque</p><p align="center"><h5>'+movimiento.Fecha+'</h5></p><h2>'+
                      movimiento.Peso+'Kg.</h2><h5><p align="left">Material:</p></h5><p align="left">'+
                      movimiento.NombreMaterial+'</p><h5><p align="left">'+movimiento.CodigoControl+'</p></h5>',
              template:'',
              buttons: [
                {
                  text:'Aceptar',
                  type:"button-balanced",
                  onTap: function(e){
                  alert="";

                  return true;   
                }},]

            })
    }

  })


.controller('ChatsCtrl', function($scope, Chats ,$ionicPopup,$http) {
 $scope.mostrarInformacionhistorial=function(historial){
      console.log(historial);
       var alert = $ionicPopup.alert({
          cssClass: 'yourclass',
              title:'<p align="left">Detalle de embarque</p><p align="center"><h5>'+historial.fecha+'</h5></p><h2>'+
                      historial.peso+'Kg.</h2><h5><p align="left">Material:</p></h5><p align="left">'+
                      historial.NombreMaterial+'</p><h5><p align="left">'+historial.embarques_id+'</p></h5>',
              template:'',
              buttons: [
                {
                  text:'Aceptar',
                  type:"button-balanced",
                  onTap: function(e){
                  alert="";

                  return true;   
                }},]

            })
    }

//historial ws
var historiales="";
   $http.get("http://54.218.11.27/RESTService/historial")
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

.controller('AccountCtrl', function($scope, $cordovaSQLite, $http, $ionicLoading) {
                                 
       
 
        $scope.sincro=[];

        $scope.insert = function(id, id_embarque, fecha, firma, entrada, usuario_id, ubicaciones_id, placas) {
          firma=sigImg;
          alert(firma);
        var query = "INSERT INTO rastreo (id, id_embarque, fecha, firma, entrada, usuario_id, ubicaciones_id, placas) VALUES (?,?,?,?,?,?,?,?)";

        $cordovaSQLite.execute(db, query, [id, id_embarque, fecha, firma, entrada, usuario_id, ubicaciones_id, placas]).then(function(res) {
            alert("INSERT ID -> " + res.insertId);
        }, function (err) {
            alert('rer'+ err);
        });
    }
 
    $scope.select = function() {
        var query = "SELECT  * FROM rastreo";
        
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
                
                for ( i=0; i < res.rows.length; i++) {

                                var id='"'+res.rows.item(i).id+'"';
                                var id_embarque='"'+res.rows.item(i).id_embarque+'"';
                                var fecha='"'+res.rows.item(i).fecha+'"';
                                var firma='"'+res.rows.item(i).firma+'"';
                                var entrada='"'+res.rows.item(i).entrada+'"';
                                var usuario_id='"'+res.rows.item(i).usuario_id+'"';
                                var ubicaciones_id='"'+res.rows.item(i).ubicaciones_id+'"';
                                var placas='"'+res.rows.item(i).placas+'"';
                                var registro = ('{"id":'+id+',"id_embarque":'+id_embarque+',"fecha":'+fecha+',"firma":'+firma+',"entrada":'+entrada+',"usuario_id":'+usuario_id+',"ubicaciones_id":'+ubicaciones_id+',"placas":'+placas+'}');
                                var registro = angular.fromJson(registro);

                                $scope.sincro.push(registro);
                                registro="";


                        
                      };

            } else {
                alert("No results found");
            }
        }, function (err) {
            alert('dd'+err);
        });
    }
 

})
