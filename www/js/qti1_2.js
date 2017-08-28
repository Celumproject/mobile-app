function prepareFrom1_2(testSession){
    var questions = new Array;
    var innerSlides = "";

    $.each(testSession.item, function(i, e){
         var propositions = [];
         var qNum = parseInt(i) + 1;
         var qId = e._ident;
         var qType = e.presentation.response_lid._rcardinality;

        var qFeedbackWrong = "";//"Dommage. Vous ferez mieux à la prochaine question !";
        var qFeedbackWrongImage = "http://static.passetoncode.fr/img-panneaux/panneaux/interdiction/mini_b1.jpg";
        var qFeedbackRight = "Bien joué, c'était la bonne réponse. Vous avez mérité vos vacances !";
        var qFeedbackRightImage = "http://static.passetoncode.fr/img-panneaux/ideogrammes/mini_ideogramme07.jpg";

        var qVideo = e._video; //???????????????????????????????
        var qImage = e._image; //???????????????????????????????

        qImage = "https://domoscio.com/wp-content/uploads/logo-domoscio.svg";
        qVideo = "https://www.youtube.com/embed/8MEZjrE7OKs";


         var questionText = htmlDecode(e.presentation.material.mattext);

         innerSlides += "<div class='swiper-slide'><div class='content-block-title' style='" + couleurStyle + "'><center>Question " + qNum + "</center></div>";
         innerSlides += "<div><span>" + questionText + "</span></div>";

        //var full_image = "";

        if (qImage != null){
            innerSlides += "<center><div class='image-container'><img id='zoom_img_" + qNum + "' src='" + qImage + "'></img></div></center>";
            //full_image += "<div id='id_view_image_body_" + qNum + "' ></div>";
            //full_image += "<div id='id_view_image_" + qNum + "'  class='dezoom_image'><div id='dezoom_img_" + qNum + "'><iframe id='img_zoome_" + qNum + "' src='image_viewer.html' class='view_image_img' frameborder='0' ></iframe><i id='dezoom_img_" + qNum + "' class='f7-icons size-22 close_view_image'>close_round</i></div></div>";
        }

        if (qVideo != null){
            innerSlides += '<center><div><iframe width="320" height="177" src="' + qVideo + '" frameborder="0" allowfullscreen></iframe></div></center>';
        }

        innerSlides += "<form class='list-block inset' id='form_" + qId + "'><ul>";

        if(qType === "Single"){
          innerSlides += "<li id='list_group_title_" + qId + "' class='list-group-title'><div id='consigne_" + qId + "'> " + order_single + " </div></li>";
        } else {
          innerSlides += "<li id='list-group-title_" + qId + "' class='list-group-title'><div id='consigne_" + qId + "'> " + order_many + " </div></li>";
        }

        $.each(e.presentation.response_lid.render_choice.response_label, function(j, p){
            var prop_id = p._ident;
            var prop_text = htmlDecode(p.material.mattext);

            propositions.push(new Proposition(prop_id, prop_text));

            if(qType === "Single"){
              innerSlides += "<li><label for='answer_" + qId + "_" + prop_id + "' class='label-radio item-content'>";
              innerSlides += "<input type='radio' name='radio_" + qId + "' id='answer_" + qId + "_" + prop_id + "' value=" + prop_id + "/><div class='item-media'><i class='icon icon-form-radio'></i></div><div class='item-inner' id='answer_content_" + qId + "_" + prop_id + "'><div class='item-title'>" + prop_text + "</div></div>";
              innerSlides += "</label></li>";
            } else {
              innerSlides += "<li><label for='answer_" + qId + "_" + prop_id + "' class='label-checkbox item-content'>";
              innerSlides += "<input type='checkbox' name='checkbox_" + qId + "' id='answer_" + qId + "_" + prop_id + "' value=" + prop_id + "/><div class='item-media'><i class='icon icon-form-checkbox'></i></div><div class='item-inner' id='answer_content_" + qId + "_" + prop_id + "'><div class='item-title'>" + prop_text + "</div></div>";
              innerSlides += "</label></li>";
            }
        });

        innerSlides += "</ul></form>";

        if (qFeedbackRight != "" || FeedbackRightImage != "" ){
            innerSlides += "<div id='feedback_" + qId + "_right' class='feedback-hidden'>";
            if (qFeedbackRight != ""){
                innerSlides += "<div class='feedback-content'>" + qFeedbackRight + "</div>";
            }
            if (qFeedbackRightImage != ""){
                innerSlides += "<center><div class='image-container'><img src='" + qFeedbackRightImage + "'></img></div></center>";
            }
            innerSlides += "</div>";
        }
        if (qFeedbackWrong != "" || qFeedbackWrongImage != "" ){
            innerSlides += "<div id='feedback_" + qId + "_wrong' class='feedback-hidden'>";
            if (qFeedbackWrong != ""){
                innerSlides += "<div class='feedback-content'>" + qFeedbackWrong + "</div>";
            }
            if (qFeedbackWrongImage != ""){
                innerSlides += "<center><div class='image-container'><img src='" + qFeedbackWrongImage + "'></img></div></center>";
            }
            innerSlides += "</div>";
        }
        innerSlides += "<div id='block_" + qId + "' class='content-block'><div id='btn-q_" + qNum + "' class='button ripple question_form majuscule'> " + answer_text + " </div></div>";
        //innerSlides += full_image;
        innerSlides += "</div>";

        var qCorrect = [new Array(), new Array()];

        if(e.resprocessing.respcondition instanceof Array){
            $.each(e.resprocessing.respcondition, function(k, r){
                // it's a qcm
                console.log(r);
                var varScore = r.conditionvar.varequal.__text;
                if(r.setvar.__text == 100){
                   qCorrect[0].push(varScore);
                } else {
                   qCorrect[1].push(varScore);
                }
            });
        } else {
            // it's a multi select question
            $.each(e.resprocessing.respcondition.conditionvar.and.varequal, function(h, c){
              console.log(c);
              qCorrect[0].push(c.__text);
            });

             if(e.resprocessing.respcondition.conditionvar.and.not){
               $.each(e.resprocessing.respcondition.conditionvar.and.not.varequal, function(h1, c1){
                 console.log(c1);
                 qCorrect[1].push(c1.__text);
               });
             }

        }

        questions.push(new Question(qNum, qId, qType, questionText, propositions, qCorrect));

    });

    return {
        questions: questions,
        innerSlides: innerSlides
    };
}

