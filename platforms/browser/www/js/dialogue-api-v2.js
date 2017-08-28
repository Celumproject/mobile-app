function getNbReviews(){
    var student_identification = localStorage.getItem(student_identification_field_name);
    var nb_reviews = 0;
    var knowledge_node_ids = [];
    var content_ids=[];
    if (isConnected()){
        $.ajax({
            method: "GET",
            url: "http://adaptive-engine.domoscio.com/v2/instances/" + instance_id + "/review_utils/fetch_pending_reviews_questions",
            data: "token=" + token + "&" + student_identification_field_name + "=" + student_identification,
            dataType : 'json',
            async: false,
            complete: function(e, statut){
                if(e.responseText !== "null"){
                    var fetch_pending_reviews_questions = JSON.parse(e.responseText);
                    $.each(fetch_pending_reviews_questions, function(i, review){
                        if (notInArray(content_ids,review.content_id)){
                            knowledge_node_ids.push(review.knowledge_node_id);
                            content_ids.push(review.content_id);
                            nb_reviews+=1;
                        }
                    });
                    localStorage.setItem("content_ids", JSON.stringify(content_ids));
                    localStorage.setItem("knowledge_node_ids", JSON.stringify(knowledge_node_ids));
                    console.log("La liste des contents :" + content_ids);
                }
            }
        });

    }
    else{
        myApp.alert(no_signal, error);
    }
    localStorage.setItem("nb_reviews", nb_reviews);
    return nb_reviews
}


function getListeUrlQuestion() {
    var urls = [];

    if (isConnected()){

        var content_ids = JSON.parse(localStorage.getItem("content_ids"));
        $.each(content_ids, function(i, content_id){
            var url="";
            $.ajax({
                method: "GET",
                url: "http://adaptive-engine.domoscio.com/v2/instances/" + instance_id + "/contents/" + content_id,
                data: "token="+token,
                dataType : 'json',
                async: false,
                complete: function(e){
                    if(e.responseText !== "null"){
                        var content = JSON.parse(e.responseText);
                        url=content.content_url;
                    }
                }
            });
            urls.push(url);
        });
    }
    else{
        myApp.alert(no_signal, error);
    }
    return urls;
}

function sendResult(result, number){

    var content_id = JSON.parse(localStorage.getItem("content_ids"))[number-1];
    var knowledge_node_id = JSON.parse(localStorage.getItem("knowledge_node_ids"))[number-1];
    var date;
    var payload;
    if (result){payload="100"} else {payload="0"};
    console.log("number : "+number+" content : "+content_id+" knowledge_node : "+knowledge_node_id);
    $.ajax({
        method: "POST",
        url: "http://adaptive-engine.domoscio.com/v2/instances/" + instance_id + "/events?token=" + token,
        data: {
                   "student_id" : localStorage.getItem('student_id'),
                   "content_id" : content_id,
                   "type" : "EventReview",
                   "payload" : payload, //generated_at...
              },
        dataType : 'json',
        async: false,
        complete: function(e){
            date = getReviewDate(knowledge_node_id);
        }
    });
    if (stringToDate(date)<new Date()){ //La date n'a pas encore été mise à jour
        date = getReviewDate(knowledge_node_id);
        if (stringToDate(date)<new Date()){ //La mise à jour de la prochaine révision est anormalement longue, on ne l'affichera pas.
            date = "";
        }
    }
    return date;
}

function getReviewDate(knowledge_node_id){
    var date;
    $.ajax({
        method: "GET",
        url: "http://adaptive-engine.domoscio.com/v2/instances/" + instance_id + "/knowledge_node_students",
        data: "token=" + token + "&knowledge_node_id=" + knowledge_node_id,
        dataType : 'json',
        async: false,
        complete: function(e){
            var knowledge_node_student = JSON.parse(e.responseText)[0];
            date = knowledge_node_student.next_review_at;
        }
    });
    return date;
}
