var mIsMobileBrowser = false;
var el = document.getElementById("expression-list");
var backButton = document.getElementById("back-icon");
//Bootstrap's XS param covering screen sizes smaller than 768px;
var bootstrapXsParam = 768;

 // executes when HTML-Document is loaded and DOM is ready
$(document).ready(function() {
  isMobileBrowser();
});


//Captures width resize
$(window).resize(function() {
  isMobileBrowser();
});

function isMobileBrowser(width) {
    if($(window).width() <= bootstrapXsParam) {
        mIsMobileBrowser = true;
        $('#hidden-header').show();
        return true;
    } else {
        mIsMobileBrowser = false;
        el.style.visibility = "visible";
        $('#hidden-header').hide();
        return false;
    }
}

function closeModal() {
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

function populateExpressions(langId, name, info, mapPath) {
    $("#info").text(info);
    $("#map").attr('src', mapPath);
    var hiddenHeader = '<div id="hidden-header">' +
    '<img style="float:left;"id="back-icon" src="/images/back-icon.png" onClick="closeModal();">' + 
    '<h4 style="text-align: center;">' + name + '</h4>' +
    '</div>';
    var contextBuilder = hiddenHeader;
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
            if(isMobileBrowser()) {
                closeModal();
            }
        }
  	});
}

function update(formId, languageId) {
        var postURL = "../../api/expressions/edit/";
        var english = document.forms[formId].elements["english"].value;
        var translation = document.forms[formId].elements["translation"].value;
        var fileupload = document.forms[formId].elements["fileupload"].value;

        if(fileupload.lastIndexOf("mp3")===fileupload.length-3)
            console.log('A new file is selected. New file should be uploaded and replaced with the former one');
            //Checks if there is a new mp3 file selected
            //If there is a new file 
            //Then update the existing one 
        else
            console.log('No new file is added');
            //Otherwise leave the file as is.

        $.post( postURL, { id: formId, english: english, translation: translation }, function( data ) {
            console.log(data);
        });

    return false;
}


var formMethods = {

    addExpression: function (languageId) {
        var newCount = 0;
        var newFormId = 'new-expression-' + newCount+1;
        newForm = '<form class="form-expr" id="' + newFormId +'">' +
                '<div class="form-group">' +
                '<label for="english">English</label>' +
                '<input type="text" class="form-control" id="english" value="">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="translation">Translation</label>' +
                '<input type="text" class="form-control" id="translation" value="">' +
                '</div>' +
                '<input id="fileupload" type="file" name="files[]" data-url="/upload" multiple>' +
                '<button onSubmit="return false" class="btn btn-primary" onClick="this.create("'+newFormId+'", "'+languageId+'"); return false;" style="margin-top: 10px;">Update</button>' +
            '</form>';

        $('#expression-list').append(newForm);       
    },

    create: function(formId, languageId) {
        return false;
    }


}
