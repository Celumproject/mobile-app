// Initialize app
var myApp = new Framework7({
    swipeBackPage: false,
});
var $ = Framework7.$;

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;



// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

//Initialisation de l'application (Uniquement à la première ouverture.
if (localStorage.getItem("language") === null){
    localStorage.setItem("language", "fr");
    localStorage.setItem("notifications", "yes");
    localStorage.setItem("tuto_1", "todo");
    localStorage.setItem("tuto_2", "todo");
}



var to_logout;

//Login field
$$("#email_field").attr("name", login_field_name);
$$("#password_field").attr("name", password_field_name);
