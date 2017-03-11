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
function connect(){


}
function startSrv(){
    var form = document.getElementById("server");
    containers[0].classList.add("hide");
    w8(true);
    containers[2].classList.remove("hide");
    w8(false);
}