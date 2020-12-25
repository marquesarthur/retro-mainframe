/**
 * Created by Ing. Ernesto Pérez Amigo on 02/10/2015.
 */
(function($){
    //Clase Mensajear
    var Keyboard = function(elemento, opciones){
        /**********************/
        /* Variables privadas */
        /**********************/

        var elementoDOM = $(elemento);
        var language = [];
        var $layout = $("<div id='keyboard' class='row'/>");
        var _this = this;                   //almacenaremos el this para poder manipularlo después sin entrar en conflicto
        var optionsKeyboard = $.extend({    // Opciones del teclado y sus valores x defecto
            type: 'gatekeeper',         // Tipo de teclado a dibujar
            theme: 'default',           // Tema o estilo de CSS k se le aplicara al teclado
                                        // Temas disponibles: default, monokai, orange
            language: 'en_US',          // Lenguaje k se utilizara para dibujar el teclado
            active_shift: false,
            active_caps: false,

            is_hidden: true,            // Si el teclado se inicializa oculto o no
            open_speed: 300,            // Velocidad con k se muestra el teclado, default: 0.3 seg. Solo si is_hidden: true
            close_speed: 300,           // Velocidad con k se esconde el teclado, default: 0.1 seg. Solo si is_hidden: true
            show_on_focus_in: true,     // Mostrar el teclado cuando pierda el focus el input. Solo si is_hidden: true
            hide_on_focus_out: true,    // Esconder el teclado cuando pierda el focus el input. Solo si is_hidden: true

            trigger: undefined,         // Id del selector k al ser clickeado mostrara el teclado, ejemplo un boton

            enabled: true
        }, opciones || {});


        /********************/
        /* Metodos Privados */
        /********************/
        initKeyboard = function(){
            $('body').append($layout);

            language = languages[optionsKeyboard.language][optionsKeyboard.type];

            setupKeys();

            if (optionsKeyboard.is_hidden){
                $layout.hide();
            }

            // No funciona la option de disable o enable
            if (!optionsKeyboard.enabled){
                $('div#keyboard button').attr('disabled', 'disabled');
            }
        };

        setupKeys = function(){
            var keys = [];
            var keys1 = [];

            var divisor = false;

            $.each(language, function(key, val) {
                //if( val.d && val.u )
                if( val.d )
                    if(val.d.length == 1)
                        if(!divisor)
                            keys.push('<button class="btn btn-default char" data-up="' +  val.u + '" data-down="' +  val.d +'">'+val.d+'</button>');
                        else
                            keys1.push('<button class="btn btn-default char" data-up="' +  val.u + '" data-down="' +  val.d +'">'+val.d+'</button>');
                    else
                        if(val.d == 'divisor')
                            divisor = true;
                        else {
                            if(!divisor)
                                keys.push('<button class="btn btn-default ' +  val.d + '">' + val.u + '</button>');
                            else
                                keys1.push('<button class="btn btn-default ' +  val.d + '">' + val.u + '</button>');
                        }
            });

            $layout.append("<div class='col-md-8 col-md-offset-4 col-sm-10 col-sm-offset-1 row' id='gatekeeper' />");

            $('<div/>', {
                'id': 'keypad',
                'class': 'col-md-9 '+optionsKeyboard.theme,
                html: keys.join('')
            }).appendTo('div#gatekeeper');

            // $('<div/>', {
            //     'id': 'numpad',
            //     'class': 'col-md-3 '+optionsKeyboard.theme,
            //     html: keys1.join('')
            // }).appendTo('div#gatekeeper');

            _this.setEnabled(optionsKeyboard.enabled);

            setUpFor();
            drawChar();
        };

        hideKeyboard = function() {
            if (!$layout.is(':hidden')) {
                $layout.slideUp(optionsKeyboard.close_speed);
            }
        };

        showKeyboard = function() {
            if ($layout.is(':hidden')) {
                $layout.slideDown(optionsKeyboard.open_speed);
            }
        };

        setUpFor = function() {
            var VERIFY_STATE_DELAY = 300;

            // $('div#keypad, div#numpad').mouseenter(function() {
            //     _this.onFocus = true;
            // });
            // $('div#keypad, div#numpad').mouseleave(function() {
            //     _this.onFocus = false;
            // });

            if(optionsKeyboard.is_hidden){

                if (optionsKeyboard.show_on_focus_in) {
                    $(elementoDOM).focusin(function() {
                        showKeyboard();
                    });
                }

                if (optionsKeyboard.hide_on_focus_out) {
                    $(elementoDOM).focusout(function() {
                        if(!_this.onFocus)
                            setTimeout(function(){hideKeyboard();}, VERIFY_STATE_DELAY);
                            //hideKeyboard();
                    });
                }

                if (optionsKeyboard.trigger) {
                    var $trigger = $(optionsKeyboard.trigger);
                    $trigger.click(function(e) {
                        e.preventDefault();

                        if ($layout.is(':hidden')){
                            showKeyboard();
                            elementoDOM.focus();

                        }
                        else {
                            if(!_this.onFocus){
                                setTimeout(function(){hideKeyboard();}, VERIFY_STATE_DELAY);
                                //hideKeyboard();
                            }
                        }
                   });
                }
            }
        };

        deleteChar = function(action, char){
            pos_i = elementoDOM.prop("selectionStart");
            pos_e = elementoDOM.prop("selectionEnd");
            length = elementoDOM.val().length;
            array = elementoDOM.val().split('');

            switch (action){
                case 'delete':
                    if (pos_i < length){
                        if (pos_e - pos_i == 0)
                            array.splice(pos_i, 1);
                        else if (pos_e - pos_i > 0)
                            array.splice(pos_i, pos_e - pos_i);
                        else return false;

                        this.pos_i = pos_i;
                    }
                    break;

                case 'backspace':
                    if (pos_i > 0){
                        if (pos_e - pos_i == 0) {
                            array.splice(pos_i - 1, 1);
                            pos_i -= 1;
                        }
                        else if (pos_e - pos_i > 0)
                            array.splice(pos_i, pos_e - pos_i);
                        else return false;
                    }
                    break;

                case 'enter':
                    if(elementoDOM.is("textarea")){
                        if(pos_e < length) {
                            array_1 = array.slice(0, pos_i).concat(String.fromCharCode(13, 10));
                            array_2 = array.slice(pos_e, length);

                            array = array_1.concat(array_2);
                            pos_i += 1;
                        }

                        if(pos_e == length){
                            //array.splice(pos_i, pos_e - pos_i);
                            array.push(String.fromCharCode(13, 10));
                            pos_i = array.length;
                        }
                    }

                    break;

                default:
                    if(pos_e < length) {
                        array_1 = array.slice(0, pos_i).concat(char);
                        array_2 = array.slice(pos_e, length);

                        array = array_1.concat(array_2);
                        pos_i += 1;
                    }

                    if(pos_e == length){
                        //array.splice(pos_i, pos_e - pos_i);
                        array.push(char);
                        pos_i = array.length;
                    }
            }

            value = "";
            for (i = 0; i < array.length; i++)
                value = value.concat(array[i]);

            elementoDOM.val(value);
            elementoDOM.prop("selectionStart", pos_i);
            elementoDOM.prop("selectionEnd", pos_i);
            elementoDOM.focus();

            return true;
        };

        drawChar = function(){
            var time, shift = false, capslock = false;

            $('div#keyboard').find('button.backspace').focusin(function(e){
                time = e.timeStamp;
            });
            $('div#keyboard').find('button.backspace').focusout(function(e){
                diff = e.timeStamp - time;
                if(parseInt(diff / 1000) >= 2) {
                    elementoDOM.val('');
                }
                //console.log(diff);
            });

            $('div#keyboard').find('button').click(function(){
                var $this = $(this);
                character = $this.data('down'); // If it's a lowercase letter, nothing happens to this variable

                // Shift keys
                if ($this.hasClass('shift')) {
                    $('.char').toggleClass('uppercase');
                    $('.symbol span').toggle();

                    shift = !shift;
			        capslock = false;
                    $this.toggleClass('active');

                    return;
                }

                // Caps lock
                if ($this.hasClass('capslock')) {
                    $('.char').toggleClass('uppercase');

                    capslock = true;
                    if(capslock) $this.toggleClass('active');

                    return;
                }

                // BackSpace
                if ($this.hasClass('backspace')) {

                    deleteChar('backspace');

                    return;
                }

                // Delete
                if ($this.hasClass('delete')) {

                    deleteChar('delete');

                    return;
                }

                // Enter
                if ($this.hasClass('enter')) {

                    deleteChar('enter');

                    return;
                }

                // Enter
                if ($this.hasClass('submit')) {

                    _this.SubmitKey();

                    return;
                }

                // Uppercase letter
                if ($this.hasClass('uppercase')) character = character.toUpperCase();

                // Remove shift once a key is clicked.
                if (shift) {
                    if (capslock === false) $('.char').toggleClass('uppercase');

                    shift = false;

                    $('div#keyboard').find('button.shift').removeClass('active');
                }

                // Space
                if ($this.hasClass('space')){
                    deleteChar('space', ' ');
                    return;
                    //character = ' ';
                }

                // Tab
                if ($this.hasClass('tab')) {
                    //character = "\t";
                    console.info('La tecla Tab fue presionada.');
                    return;
                }

                // Special characters
                //if ($this.hasClass('symbol')) character = $('span:visible', $this).html();

                // Draw all other characters(letters, numbers and symbols)
                if ($this.hasClass('char')){
                    deleteChar('char', character);
                    return;
                }
                elementoDOM.focus();
            });
        };


        /***************************************************************************/
        /* Metodos Publicos (Constructor, Getters y Setters, Submit Button Action) */
        /***************************************************************************/
        _this.init = function(){
            initKeyboard();
        };

        _this.setTheme = function($value){
            $this = $('div#'+optionsKeyboard.type).find('div');
            if ($value){
                switch($value){
                    case 'monokai':
                        $this.removeClass('default');
                        $this.removeClass('orange');
                        $this.addClass('monokai');
                        break;
                    case 'orange':
                        $this.removeClass('monokai');
                        $this.removeClass('default');
                        $this.addClass('orange');
                        break;
                    default:
                        $this.removeClass('monokai');
                        $this.removeClass('orange');
                        $this.addClass('default');
                }

                optionsKeyboard.theme = $value;
            }
        };

        _this.getTheme = function(){
            return optionsKeyboard.theme;
        };

        _this.setEnabled = function($value){
            if (!$value){
                $('div#keyboard button').attr('disabled', 'disabled');
                optionsKeyboard.enabled = false;
            }
            else{
                $('div#keyboard button').removeAttr("disabled");
                optionsKeyboard.enabled = true;
            }
        };

        _this.getEnabled = function(){
            return optionsKeyboard.enabled;
        };

        _this.setHidden = function($value){
            if (!$value){
                hideKeyboard();
            }
            else{
                showKeyboard();
            }
        };

        _this.getHidden = function(){
            return optionsKeyboard.is_hidden;
        };

        _this.setOpenSpeed = function($value){
            if ($value >= 100)
                optionsKeyboard.open_speed = parseInt($value);
        };

        _this.getOpenSpeed = function(){
            return optionsKeyboard.open_speed;
        };

        _this.setCloseSpeed = function($value){
            if ($value >= 100)
                optionsKeyboard.close_speed = parseInt($value);
        };

        _this.getCloseSpeed = function(){
            return optionsKeyboard.close_speed;
        };

        _this.SubmitKey = function(){};

        /******************************/
        /* Tipos de teclado e Idiomas */
        /******************************/
        var languages = {
            en_US : {
                gatekeeper: [
                    //{d: 'div', u: ''},
                    {d: 'q',u: 'Q'},
                    {d: 'w',u: 'W'},
                    {d: 'e',u: 'E'},
                    {d: 'r',u: 'R'},
                    {d: 't',u: 'T'},
                    {d: 'y',u: 'Y'},
                    {d: 'u',u: 'U'},
                    {d: 'i',u: 'I'},
                    {d: 'o',u: 'O'},
                    {d: 'p',u: 'P'},
                    {d: 'backspace', u: '&larr;'},   // Backspace


                    {d: 'capslock', u: '&udarr; CapsLock'}, // Caps lock
                    {d: 'a',u: 'A'},
                    {d: 's',u: 'S'},
                    {d: 'd',u: 'D'},
                    {d: 'f',u: 'F'},
                    {d: 'g',u: 'G'},
                    {d: 'h',u: 'H'},
                    {d: 'j',u: 'J'},
                    {d: 'k',u: 'K'},
                    {d: 'l',u: 'L'},
                    {d: 'shift', u: '&DoubleUpArrow; Shift'},       // Left shift
                    {d: 'z',u: 'Z'},
                    {d: 'x',u: 'X'},
                    {d: 'c',u: 'C'},
                    {d: 'v',u: 'V'},
                    {d: 'b',u: 'B'},
                    {d: 'n',u: 'N'},
                    {d: 'm',u: 'M'},
                    {d: 'delete', u: '&rarr; Del'},         // Delete
                    {d: 'enter', u: '&crarr; Enter'},


                    {d: 'space', u: 'Space'},           // Space

                    {d: 'divisor', u: 'divisor'} ,      // row divisor

                    //{d: 'backspace', u: 'BackSpace'},   // Backspace


                    {d: '7',u: '7'},
                    {d: '8',u: '8'},
                    {d: '9',u: '9'},
                    {d: '4',u: '4'},
                    {d: '5',u: '5'},
                    {d: '6',u: '6'},
                    {d: '1',u: '1'},
                    {d: '2',u: '2'},
                    {d: '3',u: '3'},
                    {d: '0',u: '0'},
                    {d: 'submit', u: 'Submit'}
                ]
            }
        };
    };

    // Esta función genera la instancia de nuestra Clase
    $.fn.keyboard = function(options){
        return this.each(function(){
            var oElemento = $(this);

            // Si ya se cuenta con una instancia del objeto
            // hacemos un return para evitar generarla nuevamente
            if(oElemento.data('pluginKeyboard')) return;

            // aquí generamos el objeto donde ingresamos el parametro
            // "this" que sera nuestro elemento
            var oKeyboard = new Keyboard(oElemento, options);
            oKeyboard.init();

            // Ahora guardamos la instancia del objeto en el elemento
            oElemento.data('pluginKeyboard', oKeyboard);
        });
    };
})(jQuery);
