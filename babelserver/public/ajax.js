function populateExpressions(langId, info, mapPath){
    $("#info").text(info);
    $("#map").attr('src', mapPath);
	var requestURI = "/api/languages/" + langId;
	$.get(requestURI, function(exprs, status){
        if (exprs.length != 0) {
    	   var contextBuilder = "";
    	   exprs.forEach(function(expr) {
    	   var outerCover = '<div id="' + expr._id + '" class="expression">' 
    		    	+ '<div>';
    	   var innerCover = '</div><audio controls style="width:100%;"><source src="' + this.audio + '" type="audio/mpeg">' 
    	   + 'Your browser does not support the audio element.' 
    	   + '</audio>' 
    	   + '</div>';
    		contextBuilder = contextBuilder +
    			outerCover + expr.english + " - " + expr.translation + innerCover;
    			$("#expressionList").html(contextBuilder);
    	   });
        }
  	});
}

function update(formId) {
    var alertItem = document.forms[formId].elements["english"].value;
    alert(alertItem);
}