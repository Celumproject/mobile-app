function loginUser(loginData){
    console.log(JSON.stringify(loginData));
    var loading_screen_user = pleaseWait({
        logo: "",
        backgroundColor: couleur,
        loadingHtml: "<h2 id='loading-screen-text' class='loading-text'> " + load_user + " </h2><div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
    });
    if (isConnected()){
        $.ajax({
            method: "POST",
            url: url_login,
            data: loginData,
            dataType: "xml",
            crossDomain: true,
            async : false,
            complete: function(e){
                if (isUser(e, loginData)){
                    if (localStorage.getItem("new_logID")==="true"){
                        var platform='';
                        if (myApp.device.android){
                            platform="android";
                        }
                        else if (myApp.device.ios){
                            platform="ios";
                        }

                        var push_engine_data = {
                            "api_id" : localStorage.getItem("student_id"),
                            "device_type" : platform,
                            "device_id" : localStorage.getItem('registrationId'),
                        }

                        $.ajax({
                            method: "POST",
                            url: "http://push-engine.domoscio.com/instances/" + instance_id + "/users?token=" + token,
                            data: push_engine_data,
                            dataType: "json",
                            async : false,
                            complete: function(e){
                                localStorage.setItem("new_logID", "false");
                            }
                        });

                        if (localStorage.getItem("student_id") === null){
                            $.ajax({
                                method: "GET",
                                url: "http://adaptive-engine.domoscio.com/v2/instances/" + instance_id + "/students",
                                data: "token=" + token + "&" + student_identification_field_name + "=" + localStorage.getItem(student_identification_field_name),
                                dataType : 'json',
                                async: false,
                                complete: function(e, statut){
                                    if(e.responseText !== "null"){
                                        var student = JSON.parse(e.responseText)[0];
                                        localStorage.setItem('student_id', student.id); //Utile pour pouvoir envoyer le résultat de l'apprenant (avec un nom de champ fixe).
                                    }
                                }
                            });
                        }
                    }
                    myApp.closeModal('.login-screen', true);
                }
                else {
                    myApp.alert(wrong_ids, login_error);
                    localStorage.setItem("loginOK", "false");
                }
            }
        });
    }
    // Cas d'ouverture de l'appli avec un utilisateur déjà connecté mais sans réseau...
    else if (localStorage.getItem("loginOK")==="true"){
        myApp.closeModal('.login-screen', true);
    }
    loading_screen_user.finish();
    actualiserPageAccueil();
}
