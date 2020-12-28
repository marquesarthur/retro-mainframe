var logIdx = 0;
var imgIdx = 0;
var ENTER = "Enter";
var TYPEWRITER_SPEED = 25;
var b = undefined;
var sound = false; // false is better for testing purposes
var user = undefined;

var muteBtn = document.getElementById('mute-button');
var anchoDiv = document.getElementById("anchor");

var imgArray = []


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

function imgData(address, base64) {
    imgArray.push(base64);
    let msg = document.createElement('div');
    msg.innerHTML = `<div style="display: flex;">
        <p title="${address} : TRANSMISSION INCOMING">
            ${address} : TRANSMISSION INCOMING
        </p>
        <button class="btn btn-default" style="border: none;" id="upload-${imgIdx}">
            <fa class="glyphicon glyphicon-download-alt"></fa>
        </button>
    </div>`;
    document.getElementById("log").insertBefore(msg, anchoDiv);
    var elem = document.getElementById('log');

    elem.scrollTop = elem.scrollHeight;
    $(`#upload-${imgIdx}`).on("click", function () {    
        new glitch("canvasData", base64);
        $('#incomingData').modal('show');
    });
    imgIdx += 1;
}


function createServer(room, loginTmp) {
    try {
        user = loginTmp;
        b = Bugout(room);
        b.on("seen", function (address) {
            log(address + " [connected]");
        });

        b.on("message", function (address, message) {
            var data = JSON.parse(message);
            if (data.type === "text") {
                var txt = data.content;
                if (data.from === "muthur") {
                    txt += " [MU/TH/UR 6000]"
                }
                log(address + ": " + txt);
            } else if (data.type === "base64") {
                imgData(address, data.content);
            } else {
                log(address + ": does not compute");
            }
            
        });

        if (user === "muthur") {
            $("#image-form").show();
        } else {
            $("#image-form").hide();
        }

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
            var data = {
                "content": event.target.textContent,
                "from": user,
                "type": "text"
            }
            b.send(JSON.stringify(data));
            event.target.textContent = "";
        }
    });

    $("#inputImg").on("click", function (event) {
        const file = document.querySelector('#file-upload').files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function () {
            var base64 = reader.result;//base64encoded string
            var data = {
                "content": base64,
                "from": user,
                "type": "base64"
            }
            b.send(JSON.stringify(data));
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
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

    // TODO: enable when done
    // var form = $('<form>' +
    //         '<input type="text" id="server" name="server" placeholder="room"/>&nbsp;&nbsp;'+
    //         '<input type="radio" id="muthur" name="login" value="muthur">&nbsp;'+
    //         '<label for="nuthur">MU/TU/UR</label>&nbsp;&nbsp;'+
    //         '<input type="radio" id="player" name="login" value="player">&nbsp;'+
    //         '<label for="player">User</label>'+
    //     '</form>');

    // bootbox.alert(form, function(){
    //     var roomTmp = $('input[name=server]').val();
    //     var loginTmp = $('input[name=login]:checked').val()
    //     createServer(roomTmp, loginTmp);
    // });
    createServer("muthur", "muthur");
    createNavBar();
});