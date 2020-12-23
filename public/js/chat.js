var logIdx = 0;
var ENTER = "Enter";
var TYPEWRITER_SPEED = 50;
var b = undefined;
var sound = true;

var muteBtn = document.getElementById('mute-button');

var GLITCH = {
    destroy: false, // set 'true' to stop the plugin
    glitch: true, // set 'false' to stop glitching
    scale: true, // set 'false' to stop scaling
    blend: true, // set 'false' to stop glitch blending
    blendModeType: 'hue', // select blend mode type
    glitch1TimeMin: 600, // set min time for glitch 1 elem
    glitch1TimeMax: 900, // set max time for glitch 1 elem
    glitch2TimeMin: 10, // set min time for glitch 2 elem
    glitch2TimeMax: 115, // set max time for glitch 2 elem
    zIndexStart: 8, // because of absolute position, set z-index base value
};

// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_typewriter
function typeWriter(id, message, i) {
    if (sound){
        $("#printer-audio").get(0).play();
    }
    if (i < message.length) {
        document.getElementById(id).innerHTML += message.charAt(i);
        i++;
        setTimeout(function () {
            typeWriter(id, message, i);
        }, TYPEWRITER_SPEED);
    } else {
        document.getElementById(id).title = message;
    }
}

function log(message) {
    // var newLog = `<p title=\"${message}\">${message}</p>`;
    // var newLog = `<p id=\"log-${logIdx}\"></p>`;
    // document.getElementById("log").innerHTML += "\n" + newLog + "\n";
    
    // document.getElementById("log").textContent += message + "\n";

    let msg = document.createElement('p');
    msg.id = `log-${logIdx}`;
    document.getElementById("log").insertBefore(msg, document.getElementById("anchor"));
    typeWriter(`log-${logIdx}`, message, 0);
    logIdx += 1;
}




// log("hello world!");
function createServer() {
    try {
        b = Bugout("bugout-chat-tutorial");
        b.on("seen", function (address) {
            log(address + " [ connected ]");
        });

        b.on("message", function (address, message) {
            log(address + ": " + message);
        });

        return b;
    } catch (ex) {
        console.log(ex);
        log("Error... reconnecting");
    }
}

function createNavBar() {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#sidebarCollapse').on('click', function () {
        // open or close navbar
        $('#sidebar').toggleClass('active');
        // close dropdowns
        $('.collapse.in').toggleClass('in');
        // and also adjust aria-expanded attributes we use for the open/closed arrows
        // in our CSS
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
}

function changeButtonType(btn, value) {
    btn.title = value;

    var span = btn.querySelector('.glyphicon');
    span.classList.remove('glyphicon-volume-off', 'glyphicon-volume-up');
    span.classList.add('glyphicon-' + value);
}

function toggleSound() {
    if (sound) {
        changeButtonType(muteBtn, 'volume-off');
        sound = false;
    } else {
        changeButtonType(muteBtn, 'volume-up');
        sound = true;
    }
}

// MAIN
$(function () {
    // Execute a function when the user releases a key on the keyboard
    $("#input").on("keydown", function (event) {
        var key = event.key;
        if (key === ENTER) {
            event.preventDefault();
            b.send(event.target.textContent);
            event.target.textContent = "";
        }
    });

    $("#input").on("keyup", function (event) {
        if (sound){
            var audio = new Audio('typewriter/typewriter-key-even.wav');
            audio.play();
        }        
    });



    var welcomeMessage = "Please wait... establishing connection";
    typeWriter("welcome", welcomeMessage, 0);

    createNavBar();
    createServer();
});