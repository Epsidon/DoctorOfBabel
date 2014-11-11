var newFormCount = 0;

function addExpression (languageId) {

    newFormCount = newFormCount + 1;
    var newFormId = 'new-expression-' + newFormCount;
    newForm = '<form class="form-expr" id="' + newFormId +'">' +
            '<div class="form-group">' +
            '<label for="english">English</label>' +
            '<input type="text" class="form-control" id="english" value="">' +
            '</div>' +
            '<div class="form-group">' +
            '<label for="translation">Translation</label>' +
            '<input type="text" class="form-control" id="translation" value="">' +
            '</div>' +
            '<button class="btn btn-primary" onSubmit="return false" onClick="postExpression(\'' + newFormId + '\', \'' + languageId + '\'); return false;" style="margin-top: 10px;">Update</button>' +
            '</form>';

            console.log("New Form Id: " + newFormId);
            console.log("New Form: ");
            console.log(newForm);

        $('#expression-list').append(newForm);  
}

function postExpression (newFormId, languageId) {
    var postURL = "../../api/expressions/";
    var english = document.forms[newFormId].elements["english"].value;
    var translation = document.forms[newFormId].elements["translation"].value;
    $.post( postURL, { language: languageId, english: english, translation: translation }, function( data ) {
        if(data.numberAffected === 1) {
            alert('Expression successfully added');
        } else {
            alert('An unknown error occured');
        }
    });    
}

function update (formId, languageId) {
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
            if(data.numberAffected === 1) {
                alert('Expression modified');
            } else {
                alert('An unknown error occured');
            }
        });

    return false;
}

function removeExpression (formId) {
        var postURL = "../../api/expressions/remove/";

        $.post( postURL, { id: formId }, function( data ) {
            if(data.numberAffected !== null) {
                alert('Remove Successful');
                $('#'+formId).remove();
            }
        });

    return false;
}

// Handle ajax file uploads for audio files and images
$(document).ready(function() {
  $('.form-expr').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      url: window.location.pathname,  // dashboard/languages/lang_id
      type: 'POST',
      dataType: 'json',
      data: new FormData(this),
      mimeType: 'multipart/form-data',
      processData: false,
      contentType: false,
    })
    .done(function(data) {
      alert('it worked');
    })
    .fail(function() {
      alert("error");
    });
  });

  $('.form-lang').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        dataType: 'json',
        data: new FormData(this),
        mimeType: 'multipart/form-data',
        processData: false,
        contentType: false,
    })
    .done(function(data) {
        alert('it worked');
    })
    .fail(function() {
        alert('error');
    });
  });
});

