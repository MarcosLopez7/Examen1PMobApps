// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(){
    
    var app = angular.module('starter', ['ionic', 'starter.Storage']);
    var cliente_actual = {};
    var pedido_actual = {};
    var ing_pla_temp = [];
    var cantidades = [];
    var platillo_actial = {};
    
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
           
           var currentdate = new Date();
           var datatime = "";
           var datetimeE = "";
           
           if(10 > currentdate.getMinutes()){
               datetime = "" + currentdate.getHours() + ":0" 
               +  currentdate.getMinutes();
           } else {
               datetime = "" +currentdate.getHours() + ":" 
               +  currentdate.getMinutes();
           }
           
           if(60 < (currentdate.getMinutes() + 30)){
               datetimeE = "" + (currentdate.getHours() + 1) + ":"
               + ((currentdate.getMinutes() + 30) - 60);
           } else {
               datetimeE = "" + currentdate.getHours() + ":" 
               +  (currentdate.getMinutes() + 30);
           }
           
           var pedido = {
               id: (new Date().getTime() % 1000000).toString(),
               hora_pedido: datetime,
               hora_entrega: datetimeE,
               formato_pago: "Efectivo",
               personalizar: opcion,
               platillo: "",
               id_cliente: cliente_actual.id,
               id_receta: 0
           };
           
           pedido_actual = pedido;
           Storage.pushPedido(pedido);
           $state.go('menudia'); 
       }
    });
    
    app.controller('Logging', function($scope, $state, Storage, $http){
        Storage.nuevo();
        
        $scope.cliente = {nombre: '', password: ''};
        
       $scope.ir = function(){
           
           //var cliente = Storage.getPass($scope.cliente.nombre, $scope.cliente.password);
           
           //console.log(cliente);
           
           $http.get('http://ubiquitous.csf.itesm.mx/~pddm-1020023/servicios/examen/backend/servicio.login.php?name=' + $scope.cliente.nombre +'&pass=' + $scope.cliente.password).then(function(posts){
                  
                  if(posts.data !== "null"){
                    cliente_actual = posts.data[0];
                    $state.go('opcion');
                  } else {
                      alert("Usuario o contraseña inválidas\n");
                  }
                  
              }, function(){
                  alert("Hubo un error en el servicio\n");
              });
           /*
           if ( cliente == null){
               cliente_actual = Storage.getCliente($scope.cliente.nombre, $scope.cliente.password);
               $state.go('opcion');
           } else {
               //console.log(Storage.getPass($scope.cliente.nombre, $scope.cliente.password));
               alert("Usuario o contraseña inválidas\n");
           }
           */
       } 
    });
    
    app.controller('Seleccion', function($scope, $state, Storage, $http){
        
       
       var recetas = [];
              
       $http.get('http://ubiquitous.csf.itesm.mx/~pddm-1020023/servicios/examen/backend/servicio.receta.php').success(function(posts){                    angular.forEach(posts, function(post){
                        recetas.push(post);
              });
                $scope.recetas = recetas;
                $scope.seleccion = "";
        
                $scope.irIngredientes = function(seleccion){
                    pedido_actual.platillo = seleccion;
                    pedido_actual.id_platillo = Storage.getIdReceta(seleccion);
           
                    
                    
                    if(seleccion != ""){
                
                        $http.get('http://ubiquitous.csf.itesm.mx/~pddm-1020023/servicios/examen/backend/servicio.una.receta.php?name=' + seleccion).success(function(posts){
                            platillo_actial = posts[0];
                        
                            if(pedido_actual.personalizar === "S"){
                                $state.go('personalizar');
                            } else {
                                $http.get('http://ubiquitous.csf.itesm.mx/~pddm-1020023/servicios/examen/backend/servicio.ingredientes.receta.php?name=' + seleccion).success(function(posts){
                                    angular.forEach(posts, function(post){
                                        ing_pla_temp.push(post);
                                    });
                                    $state.go('platillo');
                                });
                            }
                        });
                    } else {
                        alert("Por favor, seleccione un platillo\n");
                    }
                };                                                                                             
        
       
        });
    });
    
    app.controller('Personalizar', function($scope, $state, Storage, $http){
        $scope.platillo = pedido_actual.platillo;
        var ingredientes = [];
        
        $http.get('http://ubiquitous.csf.itesm.mx/~pddm-1020023/servicios/examen/backend/servicio.ingredientes.php').success(function(posts){
            angular.forEach(posts, function(post){
                ingredientes.push(post);
            });
            
            $scope.ingredientes = ingredientes; 
            var centinela = false;
        
            $scope.aPlatillo = function(){
            
                for(var i = 0; i < $scope.ingredientes.length; i++){
                    if($scope.ingredientes[i].selected){
                        ing_pla_temp.push({nombre: $scope.ingredientes[i].nombre, cantidad: 1});
                        centinela = true;
                    }
                }
            
                if(centinela){
                    $state.go('platillo');
                } else {
                    alert("Por favor, seleccione por lo menos un ingrediente\n");
                }
            }
        });
        
        
    });
    
    app.controller('Platillar', function($scope, $state, Storage){
        $scope.platillo = pedido_actual.platillo;
        $scope.cliente = cliente_actual.nombre;
        
        
        
        $scope.imagen = platillo_actial.imagen;
        
        $scope.receta = platillo_actial;
        $scope.original = "";
        
        if($scope.receta.original === "S"){
            $scope.original = "es original";
        } else {
            $scope.original = "no es original";
        }
        
        $scope.ingredientes = ing_pla_temp;
        $scope.ingredientes = ing_pla_temp;
        
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
    
    app.controller('Finalizar', function($scope, $state, Storage, $http, $sce){
        $scope.cliente = cliente_actual;
        $scope.pedido = pedido_actual;
        $scope.precio = platillo_actial.precio;
        
        $scope.salir = function(){
            
            var pedidoObj = JSON.stringify(pedido_actual);
            var postURL = $sce.trustAsResourceUrl('http://ubiquitous.csf.itesm.mx/~pddm-1020023/servicios/examen/backend/servicio.insertar.pedido.php');
            
            $http.post('http://ubiquitous.csf.itesm.mx/~pddm-1020023/servicios/examen/backend/servicio.insertar.pedido.php?id=' + pedido_actual.id + '&hp=' + pedido_actual.hora_pedido + '&he=' + pedido_actual.hora_entrega + '&fp=' + pedido_actual.formato_pago + '&idc=' + pedido_actual.id_cliente + '&pe=' + pedido_actual.personalizar + '&pl=' + pedido_actual.platillo + '&idr=' + platillo_actial.id).then(function(){
                alert("Pedido recibido\n");
                $state.go('logging');
                location.reload(1);
            }, function(){
               alert("Error al guardar"); 
            });
            
            
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