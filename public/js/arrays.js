
var ARRAY_A_SPEED = 2000;
var ARRAY_B_SPEED = 3000;
var ARRAY_C_SPEED = 3500;

var ARRAY_DATA = [
    "3CMNHZ18H2", "EJKL8JVMDT", "H3ZYXOKA0H", "P0NM349YMM",
    "YKARG3120D", "IKS4CY47DO", "NXN9V8PIGW", "9WMVQ0O35L",
    "M74IXB1A24", "W7X7AJIMEM", "HGXxm1CxX8", "Cj9oEKzfob",
    "g65q2VRgv9", "gKyagoSZUa", "LBuIsZMyjb", "4zvAgYNmf6",
    "7v357WBvbs", "7DNE7ANjJn", "dBYn3z8UBJ", "JnveLnKtBy",
    "8RZYNM9EPF", "N8TNTI4UFI","9IOA8OVKSF", "P3SKO4IVHF",
    "UI40KSZDWU", "LMALAX7ZHR", "OSEIA05XL3", "N9OHOC1N21",
    "RBTLU6H8S5", "0S6A717YF0",
];


function updateArrayData(id, title, speed) {
    setTimeout(function () {
        var randomArray = ARRAY_DATA[Math.floor(Math.random() * ARRAY_DATA.length)];
        document.getElementById(id).innerHTML = title + " " + randomArray;
        document.getElementById(id).title = title + " " + randomArray;
        updateArrayData(id, title, speed);
    }, speed);
}


// MAIN
$(function () {

    updateArrayData("array-a", "ENCRYPTION-A:", ARRAY_A_SPEED);
    updateArrayData("array-b", "ENCRYPTION-B:", ARRAY_B_SPEED);
    updateArrayData("array-c", "ENCRYPTION-C:", ARRAY_C_SPEED);
});