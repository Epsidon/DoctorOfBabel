function populateExpressions(languageId){
	var requestURI = "/api/languages/" + languageId;
	$.get(requestURI, function(exprs, status){
    	var contextBuilder = "";
    	var divStart = "<div>"
    	var divEnd = "</div>"
    	exprs.forEach(function(expr) {
    		contextBuilder = contextBuilder +
    			divStart + expr.english + " - " + expr.translation + divEnd;
    			$("#expressionList").html(contextBuilder);
    	});
  	});
}
