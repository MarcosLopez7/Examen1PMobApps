(function(){
    var app = angular.module('starter.LocalStore', []);
    
    app.factory('LocalStore', function(){
        
        var storage = angular.fromJson(window.localStorage['storage'] || '[]');
        
        function persist(){
            window.localStorage['storage'] = angular.toJson(storage);
        }
        
        return {
            
        };
    
    });
    
}());