var login;
var email;
var password;
var wrong_ids;
var welcome;
var youhave;
var review_sg;
var review_pl;
var logout;
var testsession;
var stop;
var order_single;
var order_many;
var answer_text;
var wait;
var inshort;
var details;
var home;
var tuto_1;
var tuto_2;
var noLogin;
var noPassword;
var login_error;
var load_user;
var load_reviews;
var load_questions;
var no_signal;
var touch_to_refresh;
var error;
var next_question;
var next_page;
var menu_title;
var notifications;
var language;
var save;


function set_words(){
    if (localStorage.getItem("language")==="fr"){
        login = "Se connecter";
        email = "Email";
        password = "Mot de passe";
        wrong_ids = "Mauvais identiants";
        welcome = "Bienvenue";
        youhave = "Vous avez";
        review_sg = "rappel";
        review_pl = "rappels";
        logout = "Se Déconnecter";
        testsession = "Session de test";
        stop = "Stop";
        order_single = "Choisir la bonne réponse";
        order_many = "Plusieurs réponses possibles";
        answer_text = "valider";
        wait = "Un petit instant...";
        inshort = "Résumé";
        details = "En détail";
        home = "Accueil";
        next_question = "Prochaine question";
        next_page = "Résultats";
        tuto_1 = "Faites glisser l'écran vers la gauche pour changer de question.";
        tuto_2 = "Vous avez terminé ce test. Appuyez sur " + next_page + " en haut de l'écran pour accéder à la suite";
        noLogin = "Veuillez entrer votre email.";
        noPassword = "Mot de passe manquant";
        login_error = "Erreur de connexion";
        load_user = "Chargement de votre profil";
        load_reviews = "Synchronisation de vos révisions";
        load_questions = "Chargement des questions";
        no_signal = "Pas d'accès internet. Synchronisation impossible.";
        touch_to_refresh = "Touchez pour rafraîchir.";
        error = "Erreur";
        menu_title = "Paramètres";
        notifications = "Notifications";
        language = "Langue";
        save = "Appliquer";
    }
    if ( localStorage.getItem("language")==="en"){
        login = "Log In";
        email = "Email";
        password = "Password";
        wrong_ids = "Email et password don't match.";
        welcome = "Welcome";
        youhave = "You have";
        review_sg = "review";
        review_pl = "reviews";
        logout = "Log out";
        testsession = "Test Session";
        stop = "Stop";
        order_single = "Choose the right answer";
        order_many = "Many possible answers";
        answer_text = "Answer";
        wait = "Wait a moment ...";
        inshort = "In short";
        details = "Details";
        home = "Home";
        next_question = "Next question";
        next_page = "Results";
        tuto_1 = "Swip left to change question.";
        tuto_2 = "Press " + next_page + " at the top of the screen to access to your session results";
        noLogin = "Please, write your email";
        noPassword = "Oops, your forgot your password";
        login_error = "Connexion error";
        load_user = "Loading your profile";
        load_reviews = "Loading your reviews";
        load_questions = "Loading questions";
        no_signal = "No internet access. Unable to load data.";
        touch_to_refresh = "Touch to refresh.";
        error = "Error";
        menu_title = "Settings";
        notifications = "Notifications";
        language = "Language";
        save = "Save";
    }
}

function refresh_home_words(nb_reviews){
    $$("#login").html(login);
    $$("#login_button").html(login);
    $$("#email_field").attr("placeholder", email);
    $$("#password_field").attr("placeholder", password);
    $$("#welcome").html(welcome + "<br> <span id='index-username'></span>");
    $$("#youhave").html(youhave);
    $$("#logout").html(logout);
    $$("#index-username").html(localStorage.getItem("firstname"));
    $$("#index-nb-reviews").html(nb_reviews);
    var bouton_session = document.getElementById('go-test');
    if (nb_reviews===0){
        if (!bouton_session.classList.contains('disabled') ) {
            bouton_session.classList.add('disabled')
        }
        $$("#rappel-sg-pl").html( review_sg );
    }
    else {
        if (bouton_session.classList.contains('disabled') ) {
            bouton_session.classList.remove('disabled')
        }
        if (nb_reviews===1){
            $$("#rappel-sg-pl").html( review_sg );
        }
        else {
            $$("#rappel-sg-pl").html( review_pl );
        }
    }
}

function refresh_menu_words(){
    $$("#testsession").html(menu_title);
    $$("#right_navbar_text").html(home);
    $$("#notif-text-menu").html(notifications);
    $$("#lang-text-menu").html(language);
    $$("#save-param-menu").html(save);
    $$("#logout").html(logout);
}

function refresh_session_words(){
    $$("#testsession").html(testsession);
    $$("#right_navbar_link").attr("href", "session_results.html");
    $$("#right_navbar_logo").html("pause_round_fill");
    $$("#right_navbar_text").html(stop);
}

function refresh_session_results_words(){
    var rightAnswers = localStorage.getItem('rightAnswers');
    var wrongAnswers = localStorage.getItem('wrongAnswers');
    var skipped = parseInt(localStorage.getItem('totalAnswers')) - rightAnswers - wrongAnswers;
    var summary = localStorage.getItem('summary');

    $$("#total_right").html(rightAnswers);
    $$("#total_wrong").html(wrongAnswers);
    $$("#total_skipped").html(skipped);
    $$("#summary-list").html(summary);

    $$("#inshort").html(inshort);
    $$("#details").html(details);
    $$("#home").html(home);

    $$("#right_navbar_link").attr("href", "index.html");
    $$("#right_navbar_logo").html("refresh_round_fill");
    $$("#right_navbar_text").html(home);
}
