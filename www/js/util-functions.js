function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}


function findEqual(a, b) {
    var match = 0;
    for(var i=0;i<a.length;i++)
        for(var j=0;j<b.length;j++)
            if(b[j]===a[i])
            match++;

    if(match === a.length && match === b.length)
        return true;

    return false;
}


isArray = function(a) {
    return (!!a) && (a.constructor === Array);
}


function existsInArray(arr, thing){
    return arr.some(function(el){
        return el.url === thing;
    });
}

function notInArray(arr, thing){
    var tmp = false;
    $.each(arr, function(i,elem){
        if (elem===thing){
            tmp=true;
        }
    })
    return !tmp;
}

function afficheDate(d){
    var string="";
    if (d.length>0){
        string+=d[8] + d[9]+ '/' + d[5] + d[6] + '/' + d[0] + d[1] + d[2] + d[3];
    }
    return string;
}

function stringToDate(date){
    var year=parseInt(date.slice(0,4));
    var month=parseInt(date.slice(5,7));
    var day=parseInt(date.slice(8,10));
    var hours=parseInt(date.slice(11,13));
    var minutes=parseInt(date.slice(14,16));
    var seconds=parseInt(date.slice(17,19));
    var milliseconds=parseInt(date.slice(20,23));
    return new Date(year, month, day, hours, minutes, seconds, milliseconds);
}

function actualiserPageAccueil(){
    var loading_screen_home = pleaseWait({
        logo: "",
        backgroundColor: couleur,
        loadingHtml: "<h2 id='loading-screen-text' class='loading-text'> " + load_reviews + " </h2><div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
    });
    var nb_reviews=getNbReviews();
    refresh_home_words(nb_reviews);

    loading_screen_home.finish();

    // Add 'refresh' listener on Pull to refresh content
    $$('.pull-to-refresh-content').on('ptr:refresh', function (e) {
        setTimeout(function () {
            var nb_reviews=getNbReviews();
            refresh_home_words(nb_reviews);
            myApp.pullToRefreshDone();
        },600);
    });
}


function checkConnection() {
        var networkState = navigator.network.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
        return states[networkState];
}

function isConnected() {
    return (checkConnection()!=='No network connection');
}
