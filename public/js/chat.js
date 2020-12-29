var ENTER = "Enter";
var muteBtn = document.getElementById('mute-button');

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

function roomNameInput(event)
{
   if (event.keyCode == 13) {
      return false;
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
            server.send(JSON.stringify(data));
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
            server.send(JSON.stringify(data));
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    });

    $("#input").on("keyup", function (event) {
        if (sound) {
            var audio = new Audio('typewriter/typewriter-key-even.wav');
            audio.play();
        }
    });

    $('#input').keyboard({
        theme: 'monokai',
    });

    $("#tutorialBtn").on("click", function () {
        $('#tutorialData').modal('show');
    });

    // easter eggs
    $("#dec20Btn").on("click", function () {
        var msg = "Application built by /u/marques_art_boris. I hope my boss doesn't find me procrastinating.";
        server.send(JSON.stringify({"content": msg, "from": user, "type": "text"}));
    });

    $("#sept09Btn").on("click", function () {
        var msg = "If you wish to buy me a coffee, donate the money to any NGO. You are doing me a favor. Any more coffee and I'll have an overdose."
        server.send(JSON.stringify({"content": msg, "from": user, "type": "text"}));
    });

    $("#aug05Btn").on("click", function () {
        var msg = "I'm traveling to Canada to pursue a Ph.D. Please, feed my dog Boris while I am away.";
        server.send(JSON.stringify({"content": msg, "from": user, "type": "text"}));
    });

    var welcomeMessage = "Please wait... establishing connection";
    typeWriter("welcome", welcomeMessage, 0);

    // TODO: enable for prod
    var form = $('<form>' +
            '<input type="text" id="server" name="server" placeholder="room" onkeypress="return roomNameInput(event);"/>&nbsp;&nbsp;'+
            '<input type="radio" id="muthur" name="login" value="muthur">&nbsp;'+
            '<label for="nuthur">MU/TU/UR</label>&nbsp;&nbsp;'+
            '<input type="radio" id="player" name="login" value="player">&nbsp;'+
            '<label for="player">User</label>'+
        '</form>');

    bootbox.alert(form, function(){
        var roomTmp = $('input[name=server]').val();
        var loginTmp = $('input[name=login]:checked').val()
        createServer(roomTmp, loginTmp);
    });
    // TODO: dev
    // createServer("muthur", "muthur");
    createNavBar();
});