var logIdx = 0;
var imgIdx = 0;
var TYPEWRITER_SPEED = 25;

var anchorDiv = document.getElementById("anchor");
var anchorTransmissionDiv = document.getElementById("img-anchor");
var myRoomID = undefined;

var TRANSMISSIONS = [
    "UhoQYL", "N3ANAZ", "ea3wxP", "fGZHLn", "ByscOC", "1P64jQ", "0SEBPo", "86cR4t",
    "lg4oOa", "zSLHny", "ZuLD2U", "JxEJ7T", "k3pqiw", "Cj6KLQ", "rIgrWm", "b974c8",
    "Y1TcLS", "MIoKsI", "XJNN5N", "bwkrLx", "EnMQQK", "1KJi1S", "yojBy0", "AnwrnC",
    "VKzvsv", "DAh2ZR", "kY69HV", "L6w8Iu", "OO2F3o", "2XQKXG"
];

// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_typewriter
function typeWriter(id, message, i) {
    if (sound) {
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
    document.getElementById("log").insertBefore(msg, anchorDiv);
    typeWriter(`log-${logIdx}`, message, 0);
    logIdx += 1;
    var elem = document.getElementById('log');
    elem.scrollTop = elem.scrollHeight;
}

function updateTransmissionData(id, idx, speed) {
    setTimeout(function () {
        var randomArray = TRANSMISSIONS[Math.floor(Math.random() * TRANSMISSIONS.length)];
        document.getElementById(id).innerHTML = "T" + idx.toString() + "_" + randomArray;
        document.getElementById(id).title = "T" + idx.toString() + "_" + randomArray;
        updateTransmissionData(id, idx, speed);
    }, speed);
}

function imgData(address, base64) {
    log(address + ": TRANSMISSION INCOMING");
    let msg = document.createElement('div');
    msg.innerHTML = `<button class="btn btn-default" style="border: none; color: #50b480;" id="upload-${imgIdx}"></button>`;
    document.getElementById("transmission").insertBefore(msg, anchorTransmissionDiv);

    $(`#upload-${imgIdx}`).on("click", function () {
        new glitch("canvasData", base64);
        if (sound) {
            $("#camera").get(0).play();
        }
        $('#incomingData').modal('show');
    });
    updateTransmissionData(`upload-${imgIdx}`, imgIdx, 3000);
    imgIdx += 1;
}

function createServer(room, loginTmp) {
    try {
        user = loginTmp;
        server = io.connect('/');
        window.localStorage.setItem('my-room-ID', room);
        myRoomID = room;

        // server.on("seen", function (address) {
        //     log(address + " [connected]");
        // });

        server.on("server-message", function (message) {
            var data = JSON.parse(message);

            if (data.room === myRoomID) {
                if (data.type === "text") {
                    var txt = data.content;
                    if (data.from === "muthur") {
                        txt += " [MU/TH/UR 6000]"
                    } else {
                        txt = data.from + ": " + txt
                    }
                    log(txt);
                } else if (data.type === "base64") {
                    var address = data.from;
                    if (address === "muthur") {
                        address = " [MU/TH/UR 6000]"
                    }
                    imgData(address, data.content);
                } else {
                    log("does not compute");
                }
            }
        });

        if (user === "muthur") {
            $("#image-form").show();
        } else {
            $("#image-form").hide();
        }
    } catch (ex) {
        console.log(ex);
        log("Error... reconnecting");
    }
}
