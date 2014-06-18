/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



var lastLanguage = "";
var dict = [];

var jsonURI = "http://alazgulec.net/references/try.json";
var path = "cdvfile://localhost/persistent/Babel";

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //babel.initiateApp();
        getLocalReferences.getRefs();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};




var babel = {
    
initiateApp: function(){
    var turkish = [];
    turkish.push({english: 'Hello, Goodbye', foreign: 'Merhaba,Eygonlar', path: 'BT_Sound/Turkish/MerhabaEyGounlar.mp3'});
    turkish.push({english: 'Whats the problem?', foreign: 'Nasesen', path: 'BT_Sound/Turkish/Nasesen.mp3'});
    turkish.push({english: 'Yes, No', foreign: 'Evet,Hayer', path: 'BT_Sound/Turkish/EvetHayer.mp3'});
    turkish.push({english: 'Pain', foreign: 'Akherior', path: 'BT_Sound/Turkish/Akherior.mp3'});
    turkish.push({english: 'Here', foreign: 'Bourda', path: 'BT_Sound/Turkish/Bourda.mp3'});
    turkish.push({english: 'Fever', foreign: 'Atez', path: 'BT_Sound/Turkish/Atez.mp3'});
    turkish.push({english: 'Breathing', foreign: 'Nafass', path: 'BT_Sound/Turkish/NafassTurkish.mp3'});
    turkish.push({english: 'Vomit', foreign: 'Medad Boulanyor', path: 'BT_Sound/Turkish/MedadBoulanyor.mp3'});
    turkish.push({english: 'Diarrhea', foreign: 'Is Hal', path: 'BT_Sound/Turkish/IsHalTurkish.mp3'});
    turkish.push({english: 'Stool', foreign: 'Poukh', path: 'BT_Sound/Turkish/Poukh.mp3'});
    turkish.push({english: 'Urine', foreign: 'Idrar', path: 'BT_Sound/Turkish/Idrar.mp3'});
    turkish.push({english: 'Blood', foreign: 'Kan', path: 'BT_Sound/Turkish/Kan.mp3'});
    turkish.push({english: 'Pregnant', foreign: 'Hamila', path: 'BT_Sound/Turkish/Hamilas.mp3'});
    dict['Turkish'] = turkish;
    
    var french = [];
    french.push({english: 'Hello, Goodbye', foreign: 'Bonjour', path: 'BT_Sound/French/bonjour.mp3'});
    french.push({english: 'Whats the problem?', foreign: 'Quel est le probleme', path: 'BT_Sound/French/quelEstLeProbleme.mp3'});
    french.push({english: 'Yes, No', foreign: 'Oui, non', path: 'BT_Sound/French/ouiNon.mp3'});
    french.push({english: 'Pain', foreign: 'Douleur', path: 'BT_Sound/French/douleur.mp3'});
    french.push({english: 'Here', foreign: 'Ici', path: 'BT_Sound/French/ici.mp3'});
    french.push({english: 'Fever', foreign: 'fievre', path: 'BT_Sound/French/fievre.mp3'});
    french.push({english: 'Breathing', foreign: 'Respiration', path: 'BT_Sound/French/respiration.mp3'});
    french.push({english: 'Vomit', foreign: 'Vomi', path: 'BT_Sound/French/Vomi.mp3'});
    french.push({english: 'Diarrhea', foreign: 'Diarrhee', path: 'BT_Sound/French/diarrhee.mp3'});
    french.push({english: 'Stool', foreign: 'Caca', path: 'BT_Sound/French/caca.mp3'});
    french.push({english: 'Urine', foreign: 'Urine', path: 'BT_Sound/French/urine.mp3'});
    french.push({english: 'Blood', foreign: 'Sang', path: 'BT_Sound/French/sang.mp3'});
    french.push({english: 'Pregnant', foreign: 'Enceinte', path: 'BT_Sound/French/enceinte.mp3'});
    dict['French'] = french;
    
    alert('hey');

    babel.initiateMain();
},
    
initiateMain: function(references){
    var toolbar = '<div class="toolbar" style= "position: fixed;top: 0;width: 100%;z-index: 100;">'
    + '<h1 id="pageTitle"></h1>'
    + '<a id="backButton" class="button" href="#"></a>'
    + '<a id="otherButton" class="button" href="#about">?</a>'
    + '</div>';
    $("body").append(toolbar);
    
    /*
    var languageList = '<ul id="languages" title="Medical expressions in..." selected="true">'
    //THERE IS AN ISSUE PASSING PARAMETERS HERE: ("French") CAUSES SYNTAX ERROR
    + '<li><a href="javascript:;" onClick="getWords();">French</a></li>'
    //THERE IS AN ISSUE PASSING PARAMETERS HERE: ("French") CAUSES SYNTAX ERROR
    + '<li><a href="javascript:;" onClick="getWords();">Turkish</a></li>'
    + '<li><a href="javascript:;" onClick="getLocalReferences.getRefs();">Download</a></li>'
    + '</ul>';
    $("body").append(languageList);
    */
    
    var languageList = '<ul id="languages" title="Medical expressions in..." selected="true">';
    for (var i in dict) {
    languageList = languageList + '<li><a href="javascript:;" onClick="getWords();">' + i +'</a></li>';
    }
    languageList = languageList + '</ul>';
    $("body").append(languageList);

    
    var about = '<div id="about" title="About This App" style="margin:7px; background-color:white;">'
    + '<p>About this app:'
    +'I teach family medicine at the University of Ottawa, in Canada. Our patients speak French and English, and many other languages.'
    + '</p>'
    + '</div>';
    $("body").append(about);
    iui.showPageById("languages");

}
    
};


function getWords(){
    
    languageArray = dict["Turkish"];
    language = "Turkish";
    lastLanguage = language;
    $( "#language" ).remove();
    var funcString = '';
    for (var i in languageArray) {
        funcString = funcString + '<li><a href="javascript:;" onClick="getWordDetails('+i+');">'
        +"<span style=' font-size:14px;'>" + languageArray[i].english + "</span>"
        + "<span align='right' style='padding-top:5px;font-size:14px; float:right; position:relative; display:block;'> " +  languageArray[i].foreign + '</span></li>';
    }
    
    $("body").append("<ul id='language' title='"+ language +"'>" + funcString
                     + '<form><input type = "hidden" name = "TbBModHIDE_otherButton" value = "how" /></form>' +"</ul>");
    iui.showPageById("language");
}

function getWordDetails(elementId){
    $( "#languageDetail" ).remove();
    var funcString = '';
    funcString = funcString + '<div class="word" style = "text-align:center; font-size:200%" >'
    + dict[lastLanguage][elementId].english + "</div>"
    + '<div class="word" style = "text-align:center; font-size:200%; margin-top:10px; font-weight:bold;">' + dict[lastLanguage][elementId].foreign + '</div>'
    + '<audio controls id="audio" style="position: absolute; bottom: 0; width:100%;">' + '<source src="'+dict[lastLanguage][elementId].path+'" type="audio/mpeg">'
    + '</audio>';
    $("body").append('<div id="languageDetail" title="'
                     + dict[lastLanguage][elementId].english + ' (' + lastLanguage + ')'
                     +'" style="background-color:white;" otherButtonHref="#about2">' + funcString
                     + '<form><input type = "hidden" name = "TbBModHIDE_otherButton" value = "how" /></form>'
                     + "</div>");
    var audio = document.getElementById("audio");
    audio.play();
    iui.showPageById("languageDetail");
}

var jsonDownloader = {
    
downloadFile: function(){
    console.log('downloadFile');
    window.requestFileSystem(
                             LocalFileSystem.PERSISTENT,
                             0,
                             jsonDownloader.onRequestFileSystemSuccess,
                             jsonDownloader.fail
                             );
},
    
onRequestFileSystemSuccess: function(fileSystem){
    console.log('onRequestFileSystemSuccess');
    fileSystem.root.getFile(
                            'dummy.html',
                            {create: true, exclusive: false},
                            jsonDownloader.onGetFileSuccess,
                            jsonDownloader.fail
                            );
},
    
onGetFileSuccess: function(fileEntry){
    console.log('onGetFileSuccess!');
    //    var path = fileEntry.toURL().replace('dummy.html', '');
    var path = 'cdvfile://localhost/persistent'+ '/BabelApp/';
    var fileTransfer = new FileTransfer();
    fileEntry.remove();
    
    fileTransfer.download(
                          'http://alazgulec.net/references/references.json',
                          path + 'references.json',
                          function(file) {
                          console.log('download complete: ' + file.toURL());
                          jsonDownloader.executeJSON(file.toNativeURL());
                          jsonDownloader.showLink(file.toURL());
                          },
                          function(error) {
                          console.log('download error source ' + error.source);
                          console.log('download error target ' + error.target);
                          console.log('upload error code: ' + error.code);
                          }
                          );
    
},
    
executeJSON: function(fileURL){
    var jsonArr = JSON.parse(jsonDownloader.loadJSON(fileURL));
    console.log(jsonArr);
    
},
    
    
loadJSON: function(url) {
    return jQuery.ajax({
                       url : url,
                       async : false,
                       dataType : 'json'
                       }).responseText;
},
    
showLink: function(url){
    alert(url);
    var divEl = document.getElementById('deviceready');
    var aElem = document.createElement('a');
    aElem.setAttribute('target', '_blank');
    aElem.setAttribute('href', url);
    aElem.appendChild(document.createTextNode('Ready! Click To Open.'))
    divEl.appendChild(aElem);
},
    
fail: function(evt){
    console.log(evt.target.error.code);
}
    
};


var getLocalReferences = {
    
getRefs: function(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, getLocalReferences.gotFS, getLocalReferences.fail);
},
  
loadJSON: function(url){
    return jQuery.ajax({
                       url : url,
                       async : false,
                       dataType : 'json'
                       }).responseText;
},
gotFile: function(fileEntry){
    var localPath = fileEntry.fullPath;
    var localUrl = fileEntry.toURL();
    var nativeURL = fileEntry.toNativeURL();
    console.log('Loaded local path: ' + localPath);
    console.log('Loaded local url: ' + localUrl);
    console.log('Native URL: ' + nativeURL);
    var jsonArrString = getLocalReferences.loadJSON(localUrl);
    var jsonArr = $.parseJSON('[' + jsonArrString + ']');
    dict = jsonArr[0]["posts"];
    babel.initiateMain();
    
    /*
    for (var key in jsonArr[0]["posts"]) {
        console.log("Key: " + key);
        console.log("Value: " + jsonArr[key]);
    }
    */
},
    
gotFS: function(fileSystem){
    console.log("GOT FS");
    fileSystem.root.getDirectory('/BabelApp', {create: false}, getLocalReferences.gotDir, getLocalReferences.noSuchDirectoryExists);

},
gotDir: function(dirEntry){
    
    console.log("ENTRY");
    dirEntry.getFile("references.json", {create: false, exclusive: false}, getLocalReferences.gotFile, getLocalReferences.noSuchFileExists);
},
    
fail: function(evt){
    console.log(evt);
},
    
noSuchFileExists: function(evt){
    console.log('NO SUCH FILE EXISTS: ' + evt);
},
    
noSuchDirectoryExists: function(evt){
    console.log('NO SUCH DIRECTORY EXISTS: ' + evt);
}
};


function executeJSON(){
    
    /*
     var path = "file:///var/mobile/Applications/83E41E95-976B-48C6-898C-A7AB54B4D1E2/Documents/downloadApp/newFolder/try.json";
     path = "cdvfile://localhost/persistent/downloadApp/newFolder/try.json";
     var jsonArr = JSON.parse(loadJSON(path));
     console.log('HEADER: ' + jsonArr.menu.header);
     */
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    
}


