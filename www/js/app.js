// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(){
    
    var app = angular.module('starter', ['ionic', 'starter.Storage']);
    var cliente_actual = {};
    var pedido_actual = {};
    var ing_pla_temp = [];
    
    app.config(function($stateProvider, $urlRouterProvider){
       $stateProvider.state('logging', {
            'url': '/logging',
            'controller': 'Logging',
            'templateUrl': 'templates/logging.html'
       });
    
        $stateProvider.state('opcion', {
             'url': '/opcion',
             'controller': 'AMenu',
             'templateUrl': 'templates/opcion.html'
        });
        
        $stateProvider.state('menudia', {
              'url': '/menudia',
              'controller': 'Seleccion',
              'templateUrl': 'templates/menudia.html'
        });
        
        $stateProvider.state('personalizar', {
            'url': '/personalizar',
            'controller': 'Personalizar',
            'templateUrl': 'templates/personalizar.html'
        });
        
        $stateProvider.state('platillo', {
            'url': '/platillo',
            'controller': 'Platillar',
            'templateUrl': 'templates/platillo.html'
            
        });
        
        $stateProvider.state('final', {
            'url': '/final',
            'controller': 'Finalizar',
            'templateUrl': 'templates/final.html'
        });
        
       $urlRouterProvider.otherwise('/logging')
        
    });
    
    app.controller('AMenu', function($scope, $state, Storage){
       $scope.ir = function(opcion){
           var pedido = {
               id: new Date().getTime().toString(),
               hora_pedido: new Date().getTime().toString(),
               hora_entrega: (new Date().getTime() + 30).toString(),
               formato_pago: "",
               personalizar: opcion,
               platillo: "",
               nombre_cliente: cliente_actual.nombre
           };
           
           pedido_actual = pedido;
           Storage.pushPedido(pedido);
           $state.go('menudia'); 
       }
    });
    
    app.controller('Logging', function($scope, $state, Storage){
        Storage.nuevo();
        
        $scope.cliente = {nombre: '', password: ''};
        
       $scope.ir = function(){
           var cliente = Storage.getPass();
           
           if (Storage.getPass($scope.cliente.nombre, $scope.cliente.password)){
               cliente_actual = Storage.getCliente($scope.cliente.nombre, $scope.cliente.password);
               $state.go('opcion');
           } else {
               alert("Usuario o contraseña con cancer\n");
           }
           
       } 
    });
    
    app.controller('Seleccion', function($scope, $state, Storage){
       $scope.recetas = Storage.getBd().receta;
       $scope.seleccion = "";
        
       $scope.irIngredientes = function(seleccion){
            pedido_actual.platillo = seleccion;
           
            if(pedido_actual.personalizar === "S"){
                $state.go('personalizar');
            }  else {
                $state.go('platillo');
            }
       }
    });
    
    app.controller('Personalizar', function($scope, $state, Storage){
        $scope.platillo = pedido_actual.platillo;
        console.log(pedido_actual.platillo);
        $scope.ingredientes = Storage.getBd().ingrediente; 
        
        $scope.aPlatillo = function(){
            
            for(var i = 0; i < $scope.ingredientes.length; i++){
                if($scope.ingredientes[i].selected){
                    ing_pla_temp.push($scope.ingredientes[i].nombre);
                }
            }
            
            $state.go('platillo');
            
        }
    });
    
    app.controller('Platillar', function($scope, $state, Storage){
        $scope.platillo = pedido_actual.platillo;
        $scope.cliente = cliente_actual.nombre;
        $scope.imagen = Storage.getImagen(pedido_actual.platillo);
        if(pedido_actual.personalizar === "S"){
            $scope.ingredientes = ing_pla_temp;
        } else {
            ing_pla_temp = Storage.getIngredientes(Storage.getIdReceta(pedido_actual.platillo));
            $scope.ingredientes = ing_pla_temp;
        }
        
        $scope.regresar = function(){
            if(pedido_actual.personalizar === "S"){
                ing_pla_temp = [];
                $state.go('personalizar');
            } else {
                ing_pla_temp = [];
                $state.go('menudia');
            }
        };
        
        $scope.continuar = function(){
            $state.go('final');    
        }
    });
    
    app.controller('Finalizar', function($scope, $state, Storage){
        $scope.cliente = cliente_actual;
        
        $scope.salir = function(){
            $state.go('logging');
            location.reload(1);
        }
    });

    app.run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
                if(window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                
                if(window.StatusBar) {
                    StatusBar.styleDefault();
                }
        });
    })
}());