/*
Voici le fichier qui regroupe l'ensemble de la marche à suivre pour individualiser l'application, modifier les paramètres.
Il suffit de suivre ce fichier dans l'ordre, ligne par ligne !
*/

// Changer l'ID de l'application com.domoscio.nomdelappli dans le fichier config.XML

// Identifiants de connexion à l'instance de l'API
var version_API = 2; //1 pour la v1, 2 pour la v2.
var instance_id = 4;
//var token = "7ea9eb050b16f560413ec539ad29dbba";
var token = "8fb5a017ce7991b1121b4c7fc43f49da";

//Couleur du thème
var couleur = '#009dcc';
var couleurStyle = 'color:' + couleur;
//>>>>>>>>>>>>La couleur principal du thème est présente dans le fichier custom_color.css.

var couleurComp = 'white';
var couleurCompStyle = 'color:' + couleurComp;
//>>>>>>>>>>>>La couleur secondaire du thème est modifiable dans la feuille de style custom.css

//Paramètres login
var login_field_name = "pLogin";
var password_field_name = "pPassword";
var url_login = "http://quiz-beta.xperteam.net/webservices/usermanager.asmx/userExists";

//Paramètres user_id//user_uid
var student_identification_field_name = "student_id";

//Images-Visuels
/*
Arrière-plan ----> Remplacer les fichier background.png et background-blur.jpg dans www/img/
Icon ------------>Android : Image carrée à remplacer : www/res/icons.png
                  Ios : Remplacer les images du dossier www/res/icons/ios par des images aux mêmes dimensions.
Splashscreen ---->Android : Image quelconque à remplacer : www/res/splash.png
                  Ios : Remplacer les images du dossier www/res/splash/ios par des images aux mêmes dimensions. (> Un fond uni suffit.)
*/



//Paramètres champs des questions
/*
Penser à ajuster les noms des champs de question, les types de questions :
titre, type, url, image, texte, réponses....
directement dans le fichier qti2.js//classes.js
*/


/*
Fonction de connexion à paramétrer :
-validation de l'existence du user
-obtention de ses données (nom, prénom, uid/id)
-formats (xml, json...))
*/
function isUser(e, loginData){
    //Cette fonction renvoie true si l'utilisateur existe et false sinon. Si oui, elle enregistre ses données.

    //Paramètres de champs à configurer

    var url_login_info ="http://quiz-beta.xperteam.net/webservices/quizmanagerwebservice.asmx/UserGetInformation";
    var user_name_field_name = "lname";
    var user_firstname_field_name = "fname";
    var user_id_field_name = "";

    //La suite est configurée pour une réponse au format XML.

    var doc = e.responseXML;
    var bool = doc.getElementsByTagName("boolean")[0].childNodes[0].nodeValue;
    var is_user = false;
    if(bool === "true"){
        is_user = true;
        localStorage.setItem("loginData", JSON.stringify(loginData));
        localStorage.setItem("loginOK", "true");

        //Enregistrer les données de l'utilisateur.
        $.ajax({
            method: "POST",
            url: url_login_info,
            data: {"id" : loginData[login_field_name], "idType" : "login" },
            crossDomain: true,
            async : false,
            complete: function(e){
                    var doc = e.responseXML;
                    localStorage.setItem("name", doc.getElementsByTagName(user_name_field_name)[0].childNodes[0].nodeValue);
                    localStorage.setItem("firstname", doc.getElementsByTagName(user_firstname_field_name)[0].childNodes[0].nodeValue);
                /********************************************************************************************************/
                    localStorage.setItem(student_identification_field_name, 887); //user_id_field_name. Il faut trouver le bon champ. 887v2 2v1
            }
        });
    }
    return is_user;
}

/*
Fonction pour obtenir les questions à paramétrer (méthode d'obtention (url --> json --> xml...) et les différents traitement à effectuer
pour aboutir à un format JSON pour préparer la session de test.
*/

function getQuestionnaire(){
    //Cette fonction construit la session de test qui sera proposé à l'utilisateur.

    //On récupère tout d'abord la liste des URL des questions qui seront posées à l'utilisateur.
    //Cette fonction fait appel à une fonction de l'API. À modifier si nécessaire dans le fichier dialogue-api.js
    var urls = getListeUrlQuestion();

    //Puis on accède à leur contenu.
    localStorage.setItem("testSession", "");
    var count = 0;
    $.each(urls, function(i, url){
        // La question est enregistré au format XML.
        $.ajax({
            method: "GET",
            url: url,
            async:false,
            dataType: "xml",
            complete: function(e){
                if(e.responseText !== "null"){
                    var temp = localStorage.getItem("testSession");
                    var q = e.responseText.replace('<?xml version="1.0" encoding="utf-8"?>', "").replace('schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p2 http://www.imsglobal.org/xsd/qti/qtiv2p2/imsqti_v2p2.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2"', 'url="' + url.replace("http://quiz-beta.xperteam.net/webservices/quizmanagerwebservice.asmx/GetQuestion?pQuestionId=", "").replace("&pFormat=qti", "") + '"');
                    localStorage.setItem("testSession", temp + q);
                    count++;
                }
                if(count === (urls.length)){
                    var test = '<?xml version="1.0" encoding="utf-8"?><questestinterop title="TestSession">' + localStorage.getItem("testSession") + "</questestinterop>";
                    var xml2json = new X2JS();
                    var testSessionJson = xml2json.xml_str2json(test);

                    //On traite le contenu des questions au format JSON pour obtenir la page HTML correspondante
                    prepareTestSession(testSessionJson);
                }
            }
        });
    });
}
