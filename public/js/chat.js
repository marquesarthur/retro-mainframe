var logIdx = 0;
var ENTER = "Enter";
var TYPEWRITER_SPEED = 25;
var b = undefined;
var sound = false; // false is better for testing purposes

var muteBtn = document.getElementById('mute-button');
var anchoDiv = document.getElementById("anchor");

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
    let msg = document.createElement('p');
    msg.id = `log-${logIdx}`;
    document.getElementById("log").insertBefore(msg, anchoDiv);
    typeWriter(`log-${logIdx}`, message, 0);
    logIdx += 1;

    var elem = document.getElementById('log');
    elem.scrollTop = elem.scrollHeight;
}


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

    $('#input').keyboard({
        theme: 'monokai',
    });

    var welcomeMessage = "Please wait... establishing connection";
    typeWriter("welcome", welcomeMessage, 0);

    createNavBar();
    createServer();
});