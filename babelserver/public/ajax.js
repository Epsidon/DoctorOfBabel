var mIsMobileBrowser = false;
var el = document.getElementById("expression-list");
var backButton = document.getElementById("back-icon");

 // executes when HTML-Document is loaded and DOM is ready
$(document).ready(function() {
  isMobileBrowser();
});


//Captures width resize
$(window).resize(function() {
  isMobileBrowser();
});

function isMobileBrowser(width) {
    
    //Bootstrap's XS param covering screen sizes smaller than 768px;
    var bootstrapXsParam = 768;
    if($(window).width() <= bootstrapXsParam) {
        mIsMobileBrowser = true;
    } else {
        mIsMobileBrowser = false;
            el.style.visibility = "visible";

    }
}

function closeModal() {
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

function populateExpressions(langId, info, mapPath) {
    $("#info").text(info);
    $("#map").attr('src', mapPath);
    var backButton = '<img id = "back-icon" src="/images/back-icon.png" onClick="closeModal();">';
    var contextBuilder = backButton;
	var requestURI = "/api/languages/" + langId;
	$.get(requestURI, function(exprs, status){
        if (exprs.length != 0) {

    	   exprs.forEach(function(expr) {
    	   var outerCover = '<div id="' + expr._id + '" class="expression">' 
    		    	+ '<div>';
    	   var innerCover = '</div><audio controls style="width:100%;"><source src="' + this.audio + '" type="audio/mpeg">' 
    	   + 'Your browser does not support the audio element.' 
    	   + '</audio>' 
    	   + '</div>';
    		contextBuilder = contextBuilder +
    			outerCover + expr.english + " - " + expr.translation + innerCover;
    			$("#expression-list").html(contextBuilder);
    	   });
            if(mIsMobileBrowser) {
                closeModal();
            }
        }
  	});
}

function update(formId) {
    var alertItem = document.forms[formId].elements["english"].value;
    alert(alertItem);
}