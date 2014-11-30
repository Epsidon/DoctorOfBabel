function addExpression(languageId) {
  var newForm = 
    '<form class="form-expr-new">' +
    '<input type="hidden" name="language" value="' + languageId + '">' +
    '<input type="hidden" name="exprId" value="">' +
    '<div class="form-group">' +
    '<label for="english">English</label>' +
    '<input type="text" class="form-control" name="english" value="">' +
    '</div>' +
    '<div class="form-group">' +
    '<label for="translation">Translation</label>' +
    '<input type="text" class="form-control" name="translation" value="">' +
    '</div>' +
    '<div class="form-group">' +
    '<label for="audioFile">Upload audio file</label>' +
    '<p class="help-block">Please enter the expression audio in mp3 format</p>' +
    '<input type="file" name="audio" id="audio">' +
    '</div>' +
    '<input type="submit" class="btn btn-primary" value="Add">' +
    '</form>' +
    '<button class="btn btn-danger remove-lang">Remove</button>';
  $('#expression-list-new').prepend(newForm);
}


// Handle ajax file uploads for audio files and images
$(document).ready(function() {

  // Submit a new expression in language editor
  $(document).on('submit', '.form-expr-new', function(e) {
    e.preventDefault();
    $.ajax({
      url: '/dashboard/languages/expressions/new', 
      type: 'POST',
      dataType: 'json',
      data: new FormData(this),
      mimeType: 'multipart/form-data',
      processData: false,
      contentType: false,
      context: this,
    })
    .done(function(data) {
      if (data.error) {
        var errorAlert = $(this).children('.alert-danger');
        if (errorAlert)
          errorAlert.remove();
        $(this).prepend('<div class="alert alert-danger" role="alert">' +
                      '<p>' + data.error + '</p>' +
                      '</div>');
      } else {
        $(this).next().remove();
        $(this).remove();
        var formUpdate = 
          '<form class="form-expr-update" method="post" enctype="multipart/form-data">' +
          '<input type="hidden" name="language" value="' + data.expression.language + '">' +
          '<input type="hidden" name="exprId" value="' + data.expression._id + '">' +
          '<div class="panel panel-info expr-panel-edit">' +
          '<div class="form-group">' +
          '<label for="english">English</label>' +
          '<input type="text" class="form-control" name="english" value="' + data.expression.english +'">' +
          '</div>' +
          '<div class="form-group">' +
          '<label for="translation">Translation</label>' +
          '<input type="text" class="form-control" name="translation" value="' + data.expression.translation +'">' +
          '</div>' +
          '<div class="form-group">' +
          '<label for="audioFile">Upload audio file</label>' +
          '<p class="help-block">Please enter the expression audio in mp3 format</p>' +
          '<input type="file" name="audio" id="audio">' +
          '<div class="lang-expr-play">' +
          '<p class="help-block">Play current audio file.</p>' +
          '<span class="glyphicon glyphicon-play-circle" style="font-size:30px;" onclick="document.getElementById("expr-audio-'+data.expression._id+'").play()"></span>' +
          '<a href="/'+data.expression.audio+'">'+data.expression.audio+'</a>' +
          '<audio src="/'+data.expression.audio+'" id="expr-audio-'+data.expression._id+'"></audio>' +
          '</div>' +
          '</div>' + 
          '</div>' +
          '<input type="submit" class="btn btn-primary" value="Modify">' +
          '<input type="submit" class="btn btn-danger" name="action" value="Remove" style="margin-left: 4px;">' +
          '</form>';
        $('#expression-list-update').prepend(formUpdate);
      }
    })
    .fail(function() {
      window.alert("error");
    });
  });
  
  // When user updates an expression in language editor
  $(document).on('submit', '.form-expr-update', function(e) {
    e.preventDefault();
    $.ajax({
      url: '/dashboard/languages/expressions/update', 
      type: 'POST',
      dataType: 'json',
      data: new FormData(this),
      mimeType: 'multipart/form-data',
      processData: false,
      contentType: false,
      context: this,
    })
    .done(function(data) {
      if (data.error) {
        $(this).prepend('<div class="alert alert-danger" role="alert">' +
                      '<p>' + data.error + '</p>' +
                      '</div>');
      } else if (data.removed) {
        $(this).remove();
      } else {
        var errorAlert = $(this).children('.alert-danger');
        if (errorAlert)
          errorAlert.remove();
        window.alert('Expression updated');
      }
    })
    .fail(function() {
      alert("error");
    });
  });

  $(document).on('click', 'button.remove-lang', function(e) {
    var parent = $(this).prev();
    $(this).remove();
    $(parent).remove();
  });
});



