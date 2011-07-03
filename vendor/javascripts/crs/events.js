(function(){

    var notifications = {};

    ["new_message","chat_message"].forEach(function(name){
        notifications[name.classify()] = Ext.id()
    });

    Ext.ClassManager.set("Crs.events", notifications)

})()
