var ENTER = "Enter";

var GLITCH = {
    destroy : false, // set 'true' to stop the plugin
    glitch: true, // set 'false' to stop glitching
    scale: true, // set 'false' to stop scaling
    blend : true, // set 'false' to stop glitch blending
    blendModeType : 'hue', // select blend mode type
    glitch1TimeMin : 600, // set min time for glitch 1 elem
    glitch1TimeMax : 900, // set max time for glitch 1 elem
    glitch2TimeMin : 10, // set min time for glitch 2 elem
    glitch2TimeMax : 115, // set max time for glitch 2 elem
    zIndexStart : 8, // because of absolute position, set z-index base value
};





// log("hello world!");

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

    $("#log").mgGlitch(GLITCH);
});