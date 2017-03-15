var containers;
window.onload = function() {
    containers =  document.getElementsByClassName("container");
};
function w8(bool){
    var elem = document.getElementById("w8");
    if (bool){
        elem.classList.remove("hide");
    }
    else{
        elem.classList.add("hide");
    }
}
/*function refresh(){
    var tst = document.getElementById("tst"),
        lvl = document.getElementById("lvl"),
        tstInp = document.getElementById("tst-inp"),
        lvlInp = document.getElementById("lvl-inp");
}
*/