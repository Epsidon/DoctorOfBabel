var mIsMobileBrowser = false;
var el = document.getElementById("expression-list");
var backButton = document.getElementById("back-icon");
//Bootstrap's XS param covering screen sizes smaller than 768px;
var bootstrapXsParam = 768;

 // executes when HTML-Document is loaded and DOM is ready
//$(document).ready(function() {
//  isMobileBrowser();
//});


//Captures width resize
/*$(window).resize(function() {
  isMobileBrowser();
});*/

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

function populateExpressions(language, static) {
  $('#display-title').remove();
  $('#expr-title').removeClass('hidden');
  $('#info-title').removeClass('hidden');
  $('#expression-list').removeClass('hidden');
  $('#info-container').removeClass('hidden');
  $("#info").text(language.info);
  $("#map").attr('src', static + '/' + language.map);
  var hiddenHeader = '<div id="hidden-header">' +
  '<img style="float:left;"id="back-icon" src="' + static + '/images/back-icon.png" onClick="closeModal();">' + 
  '<h4 style="text-align: center;">' + language.name + '</h4>' +
  '</div>';
  var contextBuilder = hiddenHeader;
  var requestURI = static + "/api/languages/" + language._id;
  $.get(requestURI, function(exprs, status) {
    if (exprs.length != 0) {
      exprs.forEach(function(expr) {
        var outerCover = '<div id="' + expr._id + '" class="expression">' 
                + '<div class="exprs-container">';
        var innerCover = '</div><audio controls style="width:100%;"><source src="' + static + '/' + expr.audio + '" type="audio/mpeg">' 
        + 'Your browser does not support the audio element.' 
        + '</audio>' 
        + '</div>';
        englishExpr = '<div class="english-expr">'+expr.english+'</div>';
        translationExpr = '<div class="translation-expr">'+expr.translation+'</div>';
        contextBuilder = contextBuilder +
            outerCover + englishExpr + " " + translationExpr + innerCover;
            $("#expression-list").html(contextBuilder);
      });
      if(isMobileBrowser()) {
        closeModal();
      }
    }
  });
}

//var outerCover = '<div id="' + expr._id + '" class="expression">' 
        //         + '<div>';
        
        // var innerCover = '</div><audio src="/' + expr.audio + '" id="expr-audio-' + expr._id + '"' +
        // '</audio>' +
        // '</div>';
        // var audioButton = '<span class="glyphicon glyphicon-play-circle pull-right" style="font-size:30px;"' +
        //  'onclick=document.getElementById("expr-audio-'+expr._id+'"'+').play()'+'></span>';
        // contextBuilder = contextBuilder +
        //     outerCover + expr.english + " - " + expr.translation + audioButton + innerCover;
        //     $("#expression-list").html(contextBuilder);

