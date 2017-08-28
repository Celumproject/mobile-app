var Proposition = function(prop_id, prop_text){
    this.uid = prop_id;
    this.text = prop_text;
}

function QuestionChoixMultiples(i, e){
    //ind correspond à l'indice de la question
    //e correspond à l'objet json contenant toutes les données de la question.

    var propositions = [];
    var innerSlides="";
    var type=e.responseDeclaration._cardinality;
    var qId=e._title.replace(" ", "_");

    this.number = parseInt(i) + 1;
    this.uid = qId
    this.url = e._url;
    this.title = e._title;
    this.type = type

    this.text = htmlDecode(e.itemBody.choiceInteraction.prompt);
    this.video="https://www.youtube.com/embed/8MEZjrE7OKs";
    this.image="https://domoscio.com/wp-content/uploads/logo-domoscio.svg";
    this.feedbackWrong = "Dommage. Vous ferez mieux à la prochaine question !";
    this.feedbackRight = "Bien joué, c'était la bonne réponse.<center><div class='image-container'><img src='http://static.passetoncode.fr/img-panneaux/ideogrammes/mini_ideogramme07.jpg'></img></div></center>";

    innerSlides += "<div id='swiper_slide_'" + this.number + "' class='swiper-slide'>";
    innerSlides += "<div class='content-block-title' style='" + couleurStyle + "'><center>" + this.title + "</center></div>";
    innerSlides += "<div><span>" + this.text + "</span></div>";

    //if (qImage != null){
    if (this.number == 3){
        innerSlides += "<center><div class='image-container'><img src='" + this.image + "'></img></div></center>";
    }
    //if (qVideo != null){
    if (this.number == 2){
        innerSlides += '<center><div class="video-container"><div class="videoWrapper"><iframe  class="embed-responsive-item" width="320" height="177" src="' + this.video + '" frameborder="0" allowfullscreen></iframe></div></div></center>';
    }

    innerSlides += "<form class='list-block inset' id='form_" + this.uid + "'><ul>";

    if(this.type === "single"){
        innerSlides += "<li id='list_group_title_" + this.uid + "' class='list-group-title'><div id='consigne_" + this.uid + "'> " + order_single + " </div></li>";
    } else {
        innerSlides += "<li id='list-group-title_" + this.uid + "' class='list-group-title'><div id='consigne_" + this.uid + "'> " + order_many + " </div></li>";
    }

    $.each(e.itemBody.choiceInteraction.simpleChoice, function(j, p){
        var prop_id = p._identifier;
        var prop_text = htmlDecode(p.__text);
        propositions.push(new Proposition(prop_id, prop_text));
        if(type === "single"){
            innerSlides += "<li><label for='answer_" + qId + "_" + prop_id + "' class='label-radio item-content'>";
            innerSlides += "<input type='radio' name='radio_" + qId + "' id='answer_" + qId + "_" + prop_id + "' value=" + prop_id + "/><div class='item-media'><i class='icon icon-form-radio'></i></div><div class='item-inner' id='answer_content_" + qId + "_" + prop_id + "'><div id='answer_text_" + qId + "_" + prop_id + "' >" + prop_text + "</div></div>";
            innerSlides += "</label></li>";
        } else {
            innerSlides += "<li><label for='answer_" + qId + "_" + prop_id + "' class='label-checkbox item-content'>";
            innerSlides += "<input type='checkbox' name='checkbox_" + qId + "' id='answer_" + qId + "_" + prop_id + "' value=" + prop_id + "/><div class='item-media'><i class='icon icon-form-checkbox'></i></div><div class='item-inner' id='answer_content_" + qId + "_" + prop_id + "'><div id='answer_text_" + qId + "_" + prop_id + "'>" + prop_text + "</div></div>";
            innerSlides += "</label></li>";
        }
    });

    innerSlides += "</ul></form>";

    if (this.feedbackRight !== ""){
        innerSlides += "<div id='feedback_" + this.uid + "_right' class='feedback-hidden'>";
        innerSlides += "<div>" + this.feedbackRight + "</div>";
        innerSlides += "</div>";
    }
    if (this.feedbackWrong !== ""){
        innerSlides += "<div id='feedback_" + this.uid + "_wrong' class='feedback-hidden'>";
        innerSlides += "<div>" + this.feedbackWrong + "</div>";
        innerSlides += "</div>";
    }

    innerSlides += "<div id='block_" + this.uid + "' class='content-block'><div id='btn-q_" + this.number + "' class='button ripple question_form majuscule'> " + answer_text + " </div></div>";
    innerSlides += "</div>";

    var qCorrect = [new Array(), new Array()];
    var tempProps = propositions;
    $.each(e.responseDeclaration.correctResponse, function(k, c){
        qCorrect[0].push(c);
        tempProps.splice(tempProps.map(function(x) {return x.uid; }).indexOf(c), 1);
    });
    $.each(tempProps, function(k1,c1){
        qCorrect[1].push(c1);
    });

    this.propositions = tempProps;
    this.correctAnswers = qCorrect[0];
    this.wrongAnswers = qCorrect[1];
    this.innerSlides = innerSlides;
}

QuestionChoixMultiples.prototype.correction = function(qForm){
    var qScore;
    if(this.type.toLowerCase() === "single"){
        qScore = this.correct([qForm['radio_' + this.uid].replace('/','')]);
    } else {
        $.each(qForm['checkbox_' + this.uid], function(i, ui){
            qForm['checkbox_' + this.uid][i] = ui.replace('/','');
        });
        qScore = this.correct(qForm['checkbox_' + this.uid]);
    }
    return qScore;
}

QuestionChoixMultiples.prototype.correct = function(userInput){
    console.log(userInput, this.correctAnswers);
    var uid = this.uid;
    $.each(this.correctAnswers, function(i, a){
        $$("label[for=answer_" + uid + "_" + a + "]").addClass("bg-green");
        $('#answer_text_' + uid + '_' + a).addClass("color-response");
    });
    if (!findEqual(this.correctAnswers, userInput)) {
        $.each(userInput, function(i, ui){
            if(!$$("label[for=answer_" + uid + "_" + ui + "]").hasClass("bg-green")){
                $$("label[for=answer_" + uid + "_" + ui + "]").addClass("bg-red");
                $('#answer_text_' + uid + '_' + ui).addClass("color-response");
            }
        });
        return false;
    } else {
        return true;
    }
}
