angular.module('starter.controllers', ['ngCordova'])
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



  .controller('DashCtrl', function($scope, $cordovaBarcodeScanner, $ionicPopup){
        $scope.leerCodigo = function(){
        $cordovaBarcodeScanner.scan().then( function(imgenEscaneada){
       var alert= imgenEscaneada.text;
          var alert = $ionicPopup.alert({
  title:'',
  template:alert,
  buttons: [
    {
      text:"<b>Continuar</b>",
      type:"button-balanced",
      onTap: function(e){
      alert="Night gespche";

      return true;   
    }
    },
    ]

})
      }, function(error){
        alert("Ha ocurrido un error: :p"+ error);
      });
    }

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
  
  })


.controller('ChatsCtrl', function($scope, Chats ,$ionicPopup) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

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
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});



