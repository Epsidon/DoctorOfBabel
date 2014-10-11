function populateExpressions(langId){
	var requestURI = "/api/languages/" + langId;
	$.get(requestURI, function(exprs, status){
    	var contextBuilder = "";
    	exprs.forEach(function(expr) {
    	var outerCover = '<div id="' + expr._id + '" class="expression">' 
    		    	+ '<div>';
    	var innerCover = '</div><audio controls><source src="' + this.audio + '" type="audio/mpeg">' 
    	+ 'Your browser does not support the audio element.' 
    	+ '</audio>' 
    	+ '</div>';
    		contextBuilder = contextBuilder +
    			outerCover + expr.english + " - " + expr.translation + innerCover;
    			$("#expressionList").html(contextBuilder);
    	});
  	});
}
