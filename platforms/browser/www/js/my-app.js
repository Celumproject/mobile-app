// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    var device = myApp.device;
    if (device.ios) {
        $$("head").append($$("<link rel='stylesheet' href='lib/framework7/css/framework7.ios.min.css' type='text/css' />"));
        $$("head").append($$("<link rel='stylesheet' href='lib/framework7/css/framework7.ios.colors.min.css' type='text/css' />"));
    } else {
        $$("head").append($$("<link rel='stylesheet' href='lib/framework7/css/framework7.material.min.css' type='text/css' />"));
        $$("head").append($$("<link rel='stylesheet' href='lib/framework7/css/framework7.material.colors.min.css' type='text/css' />"));
        //$$("head").append($$("<link rel='stylesheet' href='lib/framework7/css/framework7.ios.min.css' type='text/css' />"));
        //$$("head").append($$("<link rel='stylesheet' href='lib/framework7/css/framework7.ios.colors.min.css' type='text/css' />"));
    }
    if (device.android) {
          // Initialize Firebase
          /*var config = {
            apiKey: "AIzaSyAgKD-NEb9-ZOb8-ldN1eW2Ribz_hPkLY0",
            authDomain: "domoscio-app-test.firebaseapp.com",
            databaseURL: "https://domoscio-app-test.firebaseio.com",
            projectId: "domoscio-app-test",
            storageBucket: "domoscio-app-test.appspot.com",
            messagingSenderId: "451752671060"
          };
          firebase.initializeApp(config);*/
    }

    $$("head").append($$("<link rel='stylesheet' href='css/custom_colors.css' type='text/css' />"));
    $$("head").append($$("<link rel='stylesheet' href='css/styles.css' type='text/css' />"));
    $$("head").append($$("<link rel='stylesheet' href='css/custom.css' type='text/css' />"));

    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 4000);
    mainView.hideNavbar();


    var push = PushNotification.init({
        "android": {
            "senderID": "451752671060"
        },
        "browser": {pushServiceURL: 'http://push.api.phonegap.com/v1/push'},
        "ios": {
            "sound": true,
            "vibration": true,
            "badge": true
        },
        "windows": {}
    });

    push.on('registration', function(data) {
        console.log('registration event: ' + data.registrationId);
        var oldRegId = localStorage.getItem('registrationId');
        if (oldRegId !== data.registrationId) {
            // Save new registration ID
            localStorage.setItem("registrationId", data.registrationId);
            // Post registrationId to your app server as the value has changed
            localStorage.setItem("new_logID", "true");
        }
        registrationId = data.registrationId;
        
    });

    push.on('error', function(e) {
        console.log("push error = " + e.message);
    });

    push.on('notification', function(data) {
        console.log('notification event');
        navigator.notification.alert(
            data.message,         // message
            null,                 // callback
            data.title,           // title
            'Ok'                  // buttonName
        );
    });

    set_words();
    refresh_home_words(0);


    if (localStorage.getItem("loginOK")==="true"){
        loginUser(JSON.parse(localStorage.getItem("loginData")));
    }
});

myApp.onPageInit('index', function(page){
    if (to_logout === true){
        myApp.loginScreen('.login-screen');
        to_logout=false;
    }
    else {
        actualiserPageAccueil();
    }
    mainView.hideNavbar();
});

myApp.onPageBack('menu', function(){
    $$("#right_navbar_link").removeClass("back");
    refresh_home_words(parseInt(localStorage.getItem("nb_reviews")));
    mainView.hideNavbar();
});

myApp.onPageInit('menu', function(page){
    actualiserMenu();
    mainView.showNavbar();
});

myApp.onPageInit('session', function(page){

    //Add Waiting
    var loading_screen_session = pleaseWait({
      logo: "",
      backgroundColor: couleur,
      loadingHtml: "<h2 id='loading-screen-text' class='loading-text'> " + load_questions + " </h2><div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
    });
    refresh_session_words();
    if (isConnected()){
        mainView.showNavbar();
        getQuestionnaire();
    }
    else{
        mainView.hideNavbar();
        var html = '<div class="sync-session-block"><center><h2>'+error+'</h2><div>' + no_signal + '<br>' + touch_to_refresh + ' <br></div><i class="f7-icons size-22 icon-refresh-session">refresh</i></center></div><a href="#" class="full-screen sync-session"></a>'
        $$(".swiper-wrapper").html(html);
    }
    mainView.showNavbar();
    loading_screen_session.finish();

    $$('.sync-session').on('click', function(){
        //Add Waiting
        var loading_screen_session = pleaseWait({
          logo: "",
          backgroundColor: couleur,
          loadingHtml: "<h2 id='loading-screen-text' class='loading-text'> " + load_questions + " </h2><div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
        });
        if (isConnected()){
            $$(".swiper-wrapper").html("");
            mainView.showNavbar();
            getQuestionnaire();
        }
        loading_screen_session.finish();
    });
});

myApp.onPageInit('session_results', function(page){
    refresh_session_results_words();
});

$$('#login-form .form-to-data').on('click', function(){
    var loginData = myApp.formToData('#login-form');
    if (loginData[login_field_name]===""){
        myApp.alert(noLogin, login_error);
    }
    else if (loginData[password_field_name]===""){
        myApp.alert(noPassword, login_error);
    }
    else {
        if (JSON.stringify(loginData)!==JSON.stringify(localStorage.getItem("loginData"))){
            localStorage.setItem("new_logID", "true");
        }
        loginUser(loginData);
    }
});
