var ENTER = "Enter";


log("hello world!");

var b = Bugout("bugout-chat-tutorial");
b.on("seen", function (address) { 
    log(address + " [ seen ]"); 
});

b.on("message", function (address, message) {
    log(address + ": " + message);
});




 


$(function() {
    // Execute a function when the user releases a key on the keyboard
    $("#input").on("keydown", function(event) {
        var key = event.key;
        if (key === ENTER) {
            event.preventDefault();
            
                b.send(event.target.textContent);
                event.target.textContent = "";
            
        }
    });
});