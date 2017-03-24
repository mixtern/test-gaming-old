window.addEventListener("load",function(){
    var wv = document.getElementById('wv');
    wv.addEventListener("did-stop-loading",function(){
        wv.openDevTools();
    });
    const remote = require('electron').remote;
    document.getElementById("min-btn").addEventListener("click", function (e) {
        var window = remote.getCurrentWindow();
        window.minimize();
    });
    document.getElementById("close-btn").addEventListener("click", function (e) {
        var window = remote.getCurrentWindow();
        window.close();
    });
});