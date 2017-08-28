function prepareTestSession(testSessionJson){

    var qtiFormat = testSessionJson.questestinterop._xmlns;
    var summary = "";
    var answeredInSession = 0;
    var testSession;

    localStorage.setItem("rightAnswers", 0);
    localStorage.setItem("wrongAnswers", 0);
    localStorage.setItem("summary", summary);

    testSession = testSessionJson.questestinterop;
    result = prepareFrom2(testSession);

    localStorage.setItem("totalAnswers", result.questions.length);
    var questions = result.questions;
    var innerSlides = result.innerSlides;
    $$(".swiper-wrapper").append($$(innerSlides));

    var mySwiper = myApp.swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationHide: false,
        paginationClickable: true,
        passiveListeners: false,
    });

    //Attention au traitement suivant si on a une autre classe. Penser à bien intégrer le bouton !
    $$('.question_form').on('click', function(e){
        if (isConnected()){
            var questionNum = e.target.getAttribute('id').replace("btn-q_", "");
            var question = questions[questionNum-1];
            var questionId = question.uid;
            var qForm = myApp.formToData('#form_' + questionId);//>
            var qScore; //>boolean
            var outcome; //>texte de l'image remplaçant valider

            qScore=question.correction(qForm);//>Traitement relatif à la correction de la question.

            //Traitement relatif à l'affichage du résultat.
            if(qScore){
                outcome = "<i class='f7-icons color-green'>check_round_fill</i>";
                var total_right = localStorage.getItem("rightAnswers");
                //$$(".swiper-pagination-bullet-active").css("background", "#4caf50");
                $$("#feedback_" + question.uid + "_right").removeClass("feedback-hidden").addClass("feedback-right-block");
                localStorage.setItem("rightAnswers", parseInt(total_right) + 1);
                summary += '<li class="item-content"><div class="item-media"><i class="f7-icons color-green">check_round_fill</i></div>';
            } else {
                outcome = "<i class='f7-icons color-red'>close_round_fill</i>";
                var total_wrong = localStorage.getItem("wrongAnswers");
                //$$(".swiper-pagination-bullet-active").css("background", "#f44336");
                $$("#feedback_" + question.uid + "_wrong").removeClass("feedback-hidden").addClass("feedback-wrong-block");
                localStorage.setItem("wrongAnswers", parseInt(total_wrong) + 1);
                summary += '<li class="item-content"><div class="item-media"><i class="f7-icons color-red">close_round_fill</i></div>';
            }

            $$("#block_" + question.uid).html("<div class=''><h1><center>" + outcome + "</center></h1></div>");

            var date = sendResult(qScore, question.number);
            summary +='<div class="item-inner"><div class="item-title">' + question.title + '</div><div id="date_question_' + questionNum + '" class="item-after">' + afficheDate(date) + '</div></div></li>';

            localStorage.setItem("summary", summary);
            answeredInSession += 1;

            //Tutoriel pour accéder à la prochaine question
            if (localStorage.getItem("tuto_1") === "todo"){
                if (question.number===1 && answeredInSession ===0 && localStorage.getItem("nb_reviews")!==1) {
                    myApp.alert(tuto_1, next_question);
                    localStorage.setItem("tuto_1", "done");
                }
            }

            if(answeredInSession === questions.length){
                $$("#right_navbar_logo").html("arrow_right_fill");
                $$("#right_navbar_text").html(next_page);

                //Tutoriel pour accéder à la page des résultats
                if (localStorage.getItem("tuto_2") === "todo"){
                   myApp.alert(tuto_2, next_page);
                   localStorage.setItem("tuto_2", "done");
                }
            }
        }
        else{
            myApp.alert(no_signal, error);
        }
    });
}
