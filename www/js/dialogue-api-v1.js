function getNbReviews(){
    var student_identification = localStorage.getItem(student_identification_field_name);
    var nb_reviews = 0;
    var knowledge_node_ids = [];
    var knowledge_node_student_ids = [];
    if (isConnected()){
        $.ajax({
            method: "GET",
            url: "http://stats-engine.domoscio.com/v1/instances/" + instance_id + "/review_utils/fetch_reviews",
            data: "token=" + token + "&" + student_identification_field_name + "=" + student_identification, // + "&pending=true",
            dataType : 'json',
            async: false,
            complete: function(e, statut){
                if(e.responseText !== "null"){
                    var fetch_reviews = JSON.parse(e.responseText);
                    $.each(fetch_reviews, function(i, knowledge_node_student){
                        knowledge_node_student_ids.push(knowledge_node_student.id);
                        knowledge_node_ids.push(knowledge_node_student.knowledge_node_id);
                        nb_reviews+=1;
                    });
                }
                localStorage.setItem("knowledge_node_student_ids", JSON.stringify(knowledge_node_student_ids));
                localStorage.setItem("knowledge_node_ids", JSON.stringify(knowledge_node_ids));
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
    var knowledge_node_ids = JSON.parse(localStorage.getItem("knowledge_node_ids"));
    var urls = [];

    if (isConnected()){
        $.each(knowledge_node_ids, function(i, knowledge_node_id){
            var url=getUrlQuestion(knowledge_node_id);
            if (notInArray(urls,url)){
                urls.push(url);
            }
        });
    }
    else{
        myApp.alert(no_signal, error);
    }
    return urls;
}
//followed by
function getUrlQuestion(knowledge_node_id) {

    var url="";
    $.ajax({
        method: "GET",
        url: "http://stats-engine.domoscio.com/v1/instances/" + instance_id + "/knowledge_nodes/" + knowledge_node_id + "/knowledge_node_contents",
        data: "token="+token,
        dataType : 'json',
        async: false,
        complete: function(e){
            if(e.responseText !== "null"){
                var knowledge_node_contents = JSON.parse(e.responseText);
                var knowledge_node_content = knowledge_node_contents[Math.floor(Math.random()*knowledge_node_contents.length)];
                url=knowledge_node_content.content_url;
            }
        }
    });
    return url;
}


function sendResult(result, number){

    var knowledge_node_student_id = JSON.parse(localStorage.getItem("knowledge_node_student_ids"))[number-1];
    var date;
    var payload;
    if (result){payload="100"} else {payload="0"};

    $.ajax({
        method: "POST",
        url: "http://stats-engine.domoscio.com/v1/instances/" + instance_id + "/events?token=" + token,
        data: {
                   "knowledge_node_student_id" : knowledge_node_student_id,
                   "type" : "EventResult",
                   "payload" : payload,
               },
        dataType : 'json',
        async: false,
        complete: function(e){
            date = getReviewDate(knowledge_node_student_id);
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
//followed by
function getReviewDate(knowledge_node_student_id){

    var date;
    $.ajax({
        method: "GET",
        url: "http://stats-engine.domoscio.com/v1/instances/" + instance_id + "/knowledge_node_students/" + knowledge_node_student_id,
        data: "token="+token,
        dataType : 'json',
        async: false,
        complete: function(e){
            var knowledge_node_student = JSON.parse(e.responseText);
            date = knowledge_node_student.next_review_at;
        }
    });
    return date;
}
