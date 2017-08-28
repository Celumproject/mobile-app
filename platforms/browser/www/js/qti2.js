function prepareFrom2(testSession){

    var questions = new Array;
    var innerSlides = "";
    var ts = testSession.assessmentItem;

    if(!isArray(ts)){
        ts = [ts];
    }

    $.each(ts, function(i, e){
        //Test pour aiguiller vers le bon type de l'objet question.
        if (e._identifier==="choice"){
            var question=new QuestionChoixMultiples(i,e);
            innerSlides+=question.innerSlides;
            questions.push(question);
        }
        else{
            alert("Type de question " + e._identifier + " n'est pas reconnu", "Erreur");
        }
    });

    return {
        questions: questions,
        innerSlides: innerSlides
    };
}

