function actualiserMenu(){
    $$("#right_navbar_link").attr("href", "index.html").addClass("back");
    $$("#right_navbar_logo").html("undo");
    refresh_menu_words();
    var formData = {
        'notifications': [localStorage.getItem("notifications")],
        'language':localStorage.getItem("language")
    }
    if (localStorage.getItem("notifications")!=="yes"){
        formData.notif=[];
    }
    myApp.formFromData('#menu-form', formData);

    $$('.open-login-screen').on('click', function(){
        var language = localStorage.getItem("language");
        var notif = localStorage.getItem("notifications");
        var tuto_1 = localStorage.getItem("tuto_1");
        var tuto_2 = localStorage.getItem("tuto_2");
        localStorage.clear();
        localStorage.setItem("language", language);
        localStorage.setItem("notifications", notif);
        localStorage.setItem("tuto_1", tuto_1);
        localStorage.setItem("tuto_2", tuto_2);
        to_logout = true;
    });
}

function changeLanguage(){
    var form = myApp.formToData('#menu-form');
    var lang = form.language;
    localStorage.setItem("language", lang);
    set_words();
    refresh_menu_words();
}

function changeNotif(){
    var form = myApp.formToData('#menu-form');
    var notif = form.notifications[0];
    if (notif!=="yes"){notif="no"}
    if (notif==="yes"){
        localStorage.setItem("notifications", notif);
        //Activer les notifications
        myApp.alert("Vous serez alerté pour vos prochaines révisions","Notifications")
    }
    else{
        localStorage.setItem("notifications", "no");
        //Desactiver les notifications
        myApp.alert("Vous ne recevrez plus de notifications","Notifications")
    }
}
