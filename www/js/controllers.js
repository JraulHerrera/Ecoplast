var entradaSalida="1";
var signature=null;
var sigImg=null;
var registroCompletado=0;
var sincronizacioncompleta=0;
var bandera= 0;
 var length=0;

angular.module('starter.controllers', ['ionic','ngCordova',"starter.services"])
  
//controlador de logi
.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {     
    $scope.login = function() {
    
      // console.log($scope.data.username);
      nombredeusuario=$scope.data.username;
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
           
        }).success(function(data) {
           $state.go('tab.dash',{name: $scope.data.username});
         
        }).error(function(data){

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
 .controller('DashCtrl', function($scope,$state, $cordovaBarcodeScanner, $cordovaSQLite, $ionicPopup,$http ,$ionicModal){



/////////
        $scope.scren=screen.height;
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

            bandera=bandera+1;
            $scope.movimientos.push(registro);
            $scope.conembarque=bandera;
            $scope.movimientosescaneado={};
            registro="";
          }
            else
            {
              alert("Ha ocurrido un error:"+ error);
              $scope.movimientosescaneado={};
              registro="";
            }
              
          }, function(error){
              alert("Ha ocurrido un error:"+ error);
      });
          

    }
//mensaje de movimientos
var showingText="Movimiento registrado con éxito";
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

          canvas.height = 148;
          canvas.getContext('2d').scale(ratio, ratio);          
        };

        $scope.clear = function () {
          $scope.signaturePadModel.signatureConfirm = false;
          $scope.signaturePad.clear();
          $scope.signature = null;
        };
        $scope.saveCanvas = function() {
            $scope.signaturePadModel = {};
            sigImg=$scope.signature;
          $scope.signatureModal.hide();
             };
//convertir la imagen 


   //registro
    var usr=$state.params.name;
    $scope.registrar = function()
    {
        var usertemp;
        var completado=0;
        var conexion=1;
        var params ={name: usr};
        var usuario;            
          $http({
              url:'http://itsolution.mx/login/obtener',
              method:'POST',
              data:params
            })
        .success(function(data)
        { 
            var usrActual=data[0].usuario;
            var ccontrol="";
            var cmaterial="";
            var length = $scope.movimientos.length; 
            var c=0;

            var d = new Date();
            var anno=d.getFullYear();
            if((d.getMonth()+1)<10)
            {mes='0'+(d.getMonth()+1);
            }else{mes=(d.getMonth()+1);}

            if(d.getDate()<10){dia='0'+d.getDate();
            }else{dia=d.getDate();}

            if(d.getHours()<10)
            {hora='0'+d.getHours();
            }else{hora=d.getHours();}

            if(d.getMinutes()<10)
            {minutos='0'+d.getMinutes();
            }else{minutos=d.getMinutes();}

            if(d.getSeconds()<10){segundos='0'+(d.getSeconds());
            }else{segundos=d.getSeconds();}
        
            var fecha=(anno+'/'+mes+'/'+dia+' '+hora+':'+minutos+':'+segundos);
                          for ( i=0; i < length; i++)
                          {       
                              var params ={
                                        codigoControl: $scope.movimientos[i].CodigoControl,
                                        claveMaterial: $scope.movimientos[i].ClaveMaterial,
                                        nombreMaterial: $scope.movimientos[i].NombreMaterial,
                                        peso: $scope.movimientos[i].Peso,
                                        usuario: $scope.movimientos[i].usuario,
                                        nombreUsuario: usertemp,
                                        fecha: fecha,
                                        idUbicacion: $scope.movimientos[i].IdUbicacion,
                                        nombreUbicacion:$scope.movimientos[i].NombreUbicacion,
                                        entradaSalida:entradaSalida,
                                        matricula:$scope.data.matriculaVehiculo,
                                        autorizadopo:$scope.data.autorizadopor,
                                        firma:sigImg,
                                        usuarioactual:usrActual
                                      };
                                      
                                      $http({
                                        url:'http://itsolution.mx/movimientos',
                                        method:'POST',
                                        data:params
                                      })
                                      .success(function(data,status){
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
                                            $scope.conembarque=0;
                                            bandera=0;
                                            $scope.signature=null;
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
                                                $scope.conembarque=0;
                                                bandera=0;
                                                entradaSalida="1";
                                          }
                                      }).error(function(data, status) {
                                         registroCompletado=0;
                                      })


                              .error(function(data){ 
                                //consulta sincronizar
                               var query = "INSERT INTO rastreo (codigoControl, claveMaterial, nombreMaterial, peso, fecha, idUbicacion,nombreUbicacion,entradaSalida,matricula,autorizadopo,firma,usuarioactual) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                                     $cordovaSQLite.execute(db, query, [$scope.movimientos[i].CodigoControl, $scope.movimientos[i].ClaveMaterial, $scope.movimientos[i].NombreMaterial, $scope.movimientos[i].Peso, fecha, $scope.movimientos[i].IdUbicacion, $scope.movimientos[i].NombreUbicacion, entradaSalida, $scope.data.matriculaVehiculo, $scope.data.autorizadopor, sigImg, usrActual]).then(function(res) 
                                      {                                    
                                      
                                      },function (err) 
                                      {
                                           var alert = $ionicPopup.alert({
                                                title:'Error',
                                                template:err.message,
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
                                      });    
                                //termina sincronizar
                              //  console.log("valor data: "+data);
                                  if(i==length && data.length>1)
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
                                    }
                              });
                          }
        })//cierre success http usuario
        .error(function (data, status) { //error usuario
               //console.log("usuario"+usr);
                    
              var length2 = $scope.movimientos.length;
              //console.log($scope.data.autorizadopor);
          //console.log("registros "+length2);
               
              var d = new Date();
            var anno=d.getFullYear();
            if((d.getMonth()+1)<10)
            {mes='0'+(d.getMonth()+1);
            }else{mes=(d.getMonth()+1);}

            if(d.getDate()<10){dia='0'+d.getDate();
            }else{dia=d.getDate();}

            if(d.getHours()<10)
            {hora='0'+d.getHours();
            }else{hora=d.getHours();}

            if(d.getMinutes()<10)
            {minutos='0'+d.getMinutes();
            }else{minutos=d.getMinutes();}

            if(d.getSeconds()<10){segundos='0'+(d.getSeconds());
            }else{segundos=d.getSeconds();}
        
            var fecha=(anno+'/'+mes+'/'+dia+' '+hora+':'+minutos+':'+segundos);

          for ( i=0; i < length2; i++)
            {       
              var query = "INSERT INTO rastreo (codigoControl, claveMaterial, nombreMaterial, peso, fecha, idUbicacion,nombreUbicacion,entradaSalida,matricula,autorizadopo,firma,usuarioactual) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                 $cordovaSQLite.execute(db, query, [$scope.movimientos[i].CodigoControl, $scope.movimientos[i].ClaveMaterial, $scope.movimientos[i].NombreMaterial, $scope.movimientos[i].Peso, fecha, $scope.movimientos[i].IdUbicacion, $scope.movimientos[i].NombreUbicacion, entradaSalida, $scope.data.matriculaVehiculo, $scope.data.autorizadopor, sigImg, usr]).then(function(res) 
                  {                                    
                  
                  },function (err) 
                  {
                    console.log(err);
                  });                     
            }
   $scope.movimientos=[];
   $scope.conembarque=0;
          //cierre de consulta sincronizar

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

  //MOVIMIENTOS DETALLE
    $scope.mostrarInformacion=function(movimiento){
      //console.log(movimiento);
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


.controller('ChatsCtrl', function($scope ,$ionicPopup,$http) {
 
 $scope.mostrarInformacionhistorial=function(historial){

 if (historial.entrada==1) {historial.entrada='Entrada'}else{historial.entrada='Salida'}
      //console.log(historial);
       var alert = $ionicPopup.alert({
          cssClass: 'yourclass',
              title:'<p align="left">Detalle de embarque</p><p align="center"><h5>'+historial.fecha+'</h5></p><h2>'+
                      historial.peso+'Kg.</h2><h5><p align="left">Material:</p></h5><p align="left">'+
                      historial.material+'</p><h5><p align="left">'+historial.entrada+'</p></h5>',
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


    var historiales="";

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
        
        var fecha=(anno+'-'+mes+'-'+dia);
        var params ={
             fecha: fecha
            };
                
             $http({
              url:'http://itsolution.mx/historial/obtener',
              method:'POST',
              data:params
            })
             .success(function (data) {
                 $scope.historiales = data;
             });

  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

$scope.doRefresh= function(){


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
        
        var fecha=(anno+'-'+mes+'-'+dia);
  var params ={
             fecha: fecha
            };
                
             $http({
              url:'http://itsolution.mx/historial/obtener',
              method:'POST',
              data:params
            })
             .success(function (data) {
                 $scope.historiales = data;
             });

}
})


//controlador para sincronizacion 
.controller('AccountCtrl', function($scope, $cordovaSQLite, $http, $ionicPopup) {
  $scope.mostrarInformacionsincronizar=function(sincronizar){
      //console.log(sincronizar);
       var alert = $ionicPopup.alert({
         cssClass: 'yourclass',
            title:'<p align="left">Detalle de embarque</p><p align="center"><h5>'+sincronizar.fecha+'</h5></p><h2>'+
                      sincronizar.peso+'Kg.</h2><h5><p align="left">Material:</p></h5><p align="left">'+
                      sincronizar.nombreMaterial+'</p><h5><p align="left">'+sincronizar.codigoControl+'</p></h5>',
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


$scope.doRefreshsi= function(){
  $scope.sincro=[];

    var query = "SELECT  * FROM rastreo";

      $cordovaSQLite.execute(db, query).then(function(res)
       {
            if(res.rows.length > 0) {
                for ( i=0; i < res.rows.length; i++) 
                {
                  var codigoControl='"'+res.rows.item(i).codigoControl+'"';
                  var claveMaterial='"'+res.rows.item(i).claveMaterial+'"';
                  var nombreMaterial='"'+res.rows.item(i).nombreMaterial+'"';
                  var peso='"'+res.rows.item(i).peso+'"';
                  var fecha='"'+res.rows.item(i).fecha+'"';
                  var idUbicacion='"'+res.rows.item(i).idUbicacion+'"';
                  var nombreUbicacion='"'+res.rows.item(i).nombreUbicacion+'"';
                  var entradaSalida='"'+res.rows.item(i).entradaSalida+'"';
                  var matricula='"'+res.rows.item(i).matricula+'"';
                  var autorizadopo='"'+res.rows.item(i).autorizadopo+'"';
                  var firma='"'+res.rows.item(i).firma+'"';
                  var usuarioactual='"'+res.rows.item(i).usuarioactual+'"';
                  var registro = ('{"codigoControl":'+codigoControl+',"claveMaterial":'+claveMaterial+',"nombreMaterial":'+nombreMaterial+',"peso":'+peso+',"fecha":'+fecha+',"idUbicacion":'+idUbicacion+',"nombreUbicacion":'+nombreUbicacion+',"entradaSalida":'+entradaSalida+',"matricula":'+matricula+',"autorizadopo":'+autorizadopo+',"firma":'+firma+',"usuarioactual":'+usuarioactual+'}');
                  var registro = angular.fromJson(registro);
                  $scope.sincro.push(registro);
                  registro="";
                };
            }else
              {
                var alertPopup = $ionicPopup.alert({
                title: 'Sincronizacion',
                template: 'No hay nada que sincronizar',
                buttons:[{
                    type:"button-balanced",
                    text:"<b>OK</b>",
                  }]
                });
              }
        },function (err) 
          {
            //alert('dd'+err);
          });
     
}

$scope.sincro=[];
    var query = "SELECT  * FROM rastreo";
      $cordovaSQLite.execute(db, query).then(function(res)
       {
            if(res.rows.length > 0) {
                for ( i=0; i < res.rows.length; i++) 
                {
                  var codigoControl='"'+res.rows.item(i).codigoControl+'"';
                  var claveMaterial='"'+res.rows.item(i).claveMaterial+'"';
                  var nombreMaterial='"'+res.rows.item(i).nombreMaterial+'"';
                  var peso='"'+res.rows.item(i).peso+'"';
                  var fecha='"'+res.rows.item(i).fecha+'"';
                  var idUbicacion='"'+res.rows.item(i).idUbicacion+'"';
                  var nombreUbicacion='"'+res.rows.item(i).nombreUbicacion+'"';
                  var entradaSalida='"'+res.rows.item(i).entradaSalida+'"';
                  var matricula='"'+res.rows.item(i).matricula+'"';
                  var autorizadopo='"'+res.rows.item(i).autorizadopo+'"';
                  var firma='"'+res.rows.item(i).firma+'"';
                  var usuarioactual='"'+res.rows.item(i).usuarioactual+'"';
                  var registro = ('{"codigoControl":'+codigoControl+',"claveMaterial":'+claveMaterial+',"nombreMaterial":'+nombreMaterial+',"peso":'+peso+',"fecha":'+fecha+',"idUbicacion":'+idUbicacion+',"nombreUbicacion":'+nombreUbicacion+',"entradaSalida":'+entradaSalida+',"matricula":'+matricula+',"autorizadopo":'+autorizadopo+',"firma":'+firma+',"usuarioactual":'+usuarioactual+'}');
                  var registro = angular.fromJson(registro);
                  $scope.sincro.push(registro);
                  registro="";
                };
            }else
              {
                var alertPopup = $ionicPopup.alert({
                title: 'Sincronizacion',
                template: 'No hay nada que sincronizar',
                buttons:[{
                    type:"button-balanced",
                    text:"<b>OK</b>",
                  }]
                });
                
              }
        },function (err) 
          {
            
          });

/*****************sincronizar*************/
     $scope.sincronizar = function(){

      var query = "SELECT  * FROM rastreo";

      $cordovaSQLite.execute(db, query).then(function(res)
       {
            if(res.rows.length > 0) 
            {
                for ( i=0; i < res.rows.length; i++) 
                {
                  
                  var codigoControl=res.rows.item(i).codigoControl;
                  var claveMaterial=res.rows.item(i).claveMaterial;
                  var nombreMaterial=res.rows.item(i).nombreMaterial;
                  var peso=res.rows.item(i).peso;
                  var fecha=res.rows.item(i).fecha;
                  var idUbicacion=res.rows.item(i).idUbicacion;
                  var nombreUbicacion=res.rows.item(i).nombreUbicacion;
                  var entradaSalida=res.rows.item(i).entradaSalida;
                  var matricula=res.rows.item(i).matricula;
                  var autorizadopo=res.rows.item(i).autorizadopo;
                  var firma=res.rows.item(i).firma;
                  var usuarioactual=res.rows.item(i).usuarioactual;
                  var params ={                                      
                        codigoControl:res.rows.item(i).codigoControl,
                        claveMaterial:res.rows.item(i).claveMaterial,
                        nombreMaterial:res.rows.item(i).nombreMaterial,
                        peso:res.rows.item(i).peso,
                        fecha:res.rows.item(i).fecha,
                        idUbicacion:res.rows.item(i).idUbicacion,
                        nombreUbicacion:res.rows.item(i).nombreUbicacion,
                        entradaSalida:res.rows.item(i).entradaSalida,
                        matricula:res.rows.item(i).matricula,
                        autorizadopor:res.rows.item(i).autorizadopo,
                        firma:res.rows.item(i).firma,
                        usuarioactual:res.rows.item(i).usuarioactual
                  };
                   $http({
                        url:'http://itsolution.mx/sincronizar',
                        method:'POST',
                        data:params
                        })
                        .success(function(data, status, headers, config){  
                          var cControl=config.data.codigoControl;
                          var cclaveMaterial=config.data.claveMaterial;
                          var cnombreMaterial=config.data.nombreMaterial;
                          var cpeso=config.data.peso;
                          var cfecha=config.data.fecha;
                          var cidUbicacion=config.data.idUbicacion;
                          var query = "DELETE FROM rastreo WHERE codigoControl=? and claveMaterial=? and nombreMaterial=? and peso=? and fecha=? and idUbicacion=?";
                              $cordovaSQLite.execute(db,query,[cControl,cclaveMaterial,cnombreMaterial,cpeso,cfecha,cidUbicacion]).then(function(res)
                              {
                                var alertPopup = $ionicPopup.alert({
                                title: 'Sincronizacion',
                                template: 'Datos  sincronizados exitosamente',
                                buttons:[{
                                    type:"button-balanced",
                                    text:"<b>OK</b>",
                                  }]
                                 });
                                $scope.sincro=0;
                              },function(err)
                              {
                                var alertPopup = $ionicPopup.alert({
                                title: 'Sincronizacion',
                                template: 'Error de sincronizacion',
                                buttons:[{
                                    type:"button-balanced",
                                    text:"<b>OK</b>",
                                  }]
                            });
                              });
                        
                        }).error(function(data,status){
                           var alertPopup = $ionicPopup.alert({
                                title: 'Sincronizacion',
                                template: 'Datos no sincronizados',
                                buttons:[{
                                    type:"button-balanced",
                                    text:"<b>OK</b>",
                                  }]
                            });
                           
                        })
                
                } //fin for
              
            }
              else
              {
               //rows no encontrado 
              }
        },function (err) 
          {
            //error de la consulta execute
          });



     }


    /******************************************/

    
})
