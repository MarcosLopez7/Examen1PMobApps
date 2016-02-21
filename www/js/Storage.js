(function(){
    var app = angular.module('starter.Storage', []);
    
    app.factory('Storage', function(){
        
        var bd = angular.fromJson(window.localStorage['bd'] || '{}');
        function persist(){
            window.localStorage['bd'] = angular.toJson(bd);
        }
        
        return {
          nuevo: function(){
              bd = {
                        receta: [
                            {
                                id: 1, 
                                nombre: "Huitlacoche con crema", 
                                img: "../img/hui.jpg",
                                libro: "Allah Uakbar",
                                tipo: "Crema",
                                procedimiento: "Echarle crema al huitlacoche",
                                original: "S",
                                chef: "Raul Morales",
                                calorias: 2000
                            },
                            {
                                id: 2, 
                                nombre: "Fritada de ranas", 
                                img: "../img/rana.jpg",
                                libro: "Como Programar en Rana",
                                tipo: "Carne",
                                procedimiento: "Matar rana y echarla en tostada",
                                original: "N",
                                chef: "Nicolas Maduro",
                                calorias: 667
                            },
                            {
                                id: 3, 
                                nombre: "Tlacoyos", 
                                img: "../img/tla.png",
                                libro: "Tlacoyos for dummies",
                                tipo: "Carne",
                                procedimiento: "Echar chorizo a tlacoyo",
                                original: "S",
                                chef: "Raul Morales",
                                calorias: 777
                            },
                            {
                                id: 4, 
                                nombre: "Tostadas de pata", 
                                img: "../img/pata.png",
                                libro: "Patas de cabra",
                                tipo: "Carne",
                                procedimiento: "Cortar patas y echarlo en tostada",
                                original: "N",
                                chef: "Peña Nieto",
                                calorias: 678
                            },
                            {
                                id: 5, 
                                nombre: "Nopalitos con chipotle", 
                                img: "../img/nopa.jpg",
                                libro: "Nopalitos Avanzado",
                                tipo: "Verdura dura",
                                procedimiento: "Echar chipotles al nopal",
                                original: "S",
                                chef: "Chapo Guzman",
                                calorias: 1111
                            }
                        ],
                        receta_ingrediente: [
                                                {id_receta: 1, id_ingrediente: 1, cantidad: 5},
                                                {id_receta: 2, id_ingrediente: 3, cantidad: 3},
                                                {id_receta: 2, id_ingrediente: 4, cantidad: 7},
                                                {id_receta: 3, id_ingrediente: 10, cantidad: 1},
                                                {id_receta: 4, id_ingrediente: 2, cantidad: 3},
                                                {id_receta: 4, id_ingrediente: 9, cantidad: 4},
                                                {id_receta: 5, id_ingrediente: 8, cantidad: 2},
                                                {id_receta: 5, id_ingrediente: 7, cantidad: 4}
                                            ],
                        ingrediente: [
                            {id: 1, nombre: "Crema"},
                            {id: 2, nombre: "Tostada"},
                            {id: 3, nombre: "Rana"},
                            {id: 4, nombre: "Fritadas"},
                            {id: 5, nombre: "Marshmamellow"},
                            {id: 6, nombre: "Spaguetti"},
                            {id: 7, nombre: "Chipotle"},
                            {id: 8, nombre: "Nopales"},
                            {id: 9, nombre: "Patas"},
                            {id: 10, nombre: "Chorizo"}
                        ],
                        //pedido_receta: [],
                        pedido: [],
                        cliente: [
                            {
                                nombre: "Marcos", 
                                password: "12345", 
                                email: "marcos@gmail.com", 
                                telefono: "5566778899", 
                                ubicacion: "Jugueteria"
                            },
                            {
                                nombre: "Raul",
                                password: "6969",
                                email: "raulms@itesm.mx",
                                telefono: "5569696969",
                                ubicacion: "El cuarto de la princesa"
                            }
                        ]
               };
               
               persist();
               return;
              
          },
          getBd: function(){
            return bd;  
          },
          getCliente: function(nombre, pass){
              for (var i = 0; i < bd.cliente.length; i++){  
                    if(pass === bd.cliente[i].password && nombre.toLowerCase() === bd.cliente[i].nombre.toLowerCase()){
                        return bd.cliente[i];
                    }
              }
              
              return;
          },
          getPass: function(nombre, pass){
              for (var i = 0; i < bd.cliente.length; i++){  
                    if(pass === bd.cliente[i].password && nombre.toLowerCase() === bd.cliente[i].nombre.toLowerCase()){
                        return true;
                    }
              }
              
              return false;
          },
          pushPedido: function(pedido){
              bd.pedido.push(pedido);
              persist();
              return;
          },
          getImagen: function(platillo){
              
              for(var i = 0; i < bd.receta.length; i++){
                  if(platillo === bd.receta[i].nombre){
                      return bd.receta[i].img;
                  }
              }
              
              return;
          },
          getIngredientes: function(id_receta){
              
              var ingredientes = [];
              
              for (var i = 0; i < bd.receta_ingrediente.length; i++){
                  if(id_receta === bd.receta_ingrediente[i].id_receta){
                      for(var j = 0; j < bd.ingrediente.length; j++){
                          if(bd.receta_ingrediente[i].id_ingrediente == bd.ingrediente[j].id){
                              ingredientes.push(bd.ingrediente[j].nombre);
                          }
                      }
                  }
              }
              
              return ingredientes;
          },
          getIdReceta: function(receta){
              
              for(var i = 0; i < bd.receta.length; i++){
                  if(receta === bd.receta[i].nombre){
                      return bd.receta[i].id;
                  }
              }
              
          },
          getRecetaByName: function(receta){
            
              for(var i = 0; i < bd.receta.length; i++){
                  if(receta === bd.receta[i].nombre){
                      return bd.receta[i];
                  }
              }          
          }
            
        };
    });
}());