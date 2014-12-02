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
var db;

// Global collections
var languageList = [];
var expressionList = [];
var audioElement = document.createElement('audio');

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
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
            // app.receivedEvent('deviceready');
            $('body').bind('touchstart', function() {});
            $(function() {
                FastClick.attach(document.body);
            });
            $("#info-screen").hide();
            $("#expression-list").hide();

            db = window.openDatabase("Database", "1.0", "BabelAppDb", 200000);
            database.getLocalVersion(function(result) {
                if (result === -1) {
                    database.createDb(function(result) {
                        if(result === -1) {
                            alert("Database crashed! Please restart the BabelApp");
                        } else {
                            requestApi.doRequest(function(responseValue, updateUrl, versionNo) {
                                if (responseValue === 100) {
                                    console.log("Update needed");
                                    console.log("Update URL: " + updateUrl);
                                    console.log("Update URL: " + versionNo);
                                    requestApi.downloadFile();
                                    controller.displayUpdateScreen();
                                } else if (responseValue === 200) {
                                    console.log("Update is not needed");
                                } else {
                                    console.log("An error occured, carry on");
                                }
                            });
                        }
                    });
                } else {
                    requestApi.doRequest(function(responseValue, updateUrl, versionNo) {
                        if (responseValue === 100) {
                            console.log("Update needed");
                            console.log("Update URL: " + updateUrl);
                            console.log("Update URL: " + versionNo);
                            requestApi.downloadFile();
                            controller.displayUpdateScreen();
                        } else if (responseValue === 200) {
                            console.log("Update is not needed");
                            } else {
                            console.log("An error occured, carry on");
                            }
                    });
                }
            });

            $("#back-button").hide();
            controller.listLanguages();

        }
        // ,
        // // Update DOM on a Received Event
        // receivedEvent: function(id) {
        //     var parentElement = document.getElementById(id);
        //     var listeningElement = parentElement.querySelector('.listening');
        //     var receivedElement = parentElement.querySelector('.received');

    //     listeningElement.setAttribute('style', 'display:none;');
    //     receivedElement.setAttribute('style', 'display:block;');

    //     console.log('Received Event: ' + id);
    // }
};

var controller = {
    listLanguages: function() {
        database.getLanguages(function(resultSet) {
            if (resultSet !== -1) {
                $("#language-list").html('');
                $("#back-button").hide();
                $("#title").text("Doctor of Babel");
                for (var i = 0; i < resultSet.rows.length; i++) {
                        var name = resultSet.rows.item(i).name;
                        var id = resultSet.rows.item(i).id;
                        var info = resultSet.rows.item(i).info;
                        info = btoa(info);
                        var map = resultSet.rows.item(i).map;

                        var container = '<div class="list-item language" ontouchend="controller.listExpressions(\'' + id + '\', \'' + name + '\', \'' + info + '\', \'' + map + '\')">';
                        console.log(container);
                        var listLabel = '<div class="lang-label">';
                        var arrowIcon = '<span class="glyphicon glyphicon-circle-arrow-right pull-right"></span>';
                        var divEnd = '</div>';
                        $("#language-list").append(container +
                            listLabel + name +
                            divEnd +
                            arrowIcon +
                            divEnd);
                }
            } else {
                console.log("Error occurred: ListLanguages in controller");
            }
        });
    },

    listExpressions: function(languageId, languageName, info, map) {
        database.getExpressions(languageId, function(resultSet) {
            if (resultSet !== -1) {
                $("#expression-list").html('');
                $("#language-list").hide();
                $("#info-screen").hide();
                $("#expression-list").show();

                $("#back-button").unbind( "click" );
                $("#back-button").click(function() {
                    audioElement.pause();
                    controller.listLanguages();
                    $("#expression-list").hide();
                    $("#language-list").show();
                });
                $("#back-button").show();

                $("#info-button").show();
                $("#info-button").click(function() {
                    controller.displayInfoScreen(languageId, languageName, info, map);
                });
                $("#title").text(languageName);

                for (var i = 0; i < resultSet.rows.length; i++) {
                    var row = resultSet.rows.item(i);
                    var english = resultSet.rows.item(i).english;
                    var translation = resultSet.rows.item(i).translation;
                    var audio = resultSet.rows.item(i).audio;
                    var container = '<div class="list-item expression" onClick="controller.playSound(\'' + audio + '\')">';
                    var listLabel = '<div class="expr-label">';
                    var arrowIcon = '<span class="glyphicon glyphicon-play pull-right"></span>';
                    var divEnd = '</div>';
                    console.log(english);
                    $("#expression-list").append(container +
                        listLabel + english + " - " + translation +
                        divEnd +
                        arrowIcon +
                        divEnd);
                } 
                $("#expression-list").show();
            } else {
                console.log("Error occurred: listExpressions in controller");
            }
        });
    },

    displayUpdateScreen: function() {
        $("#language-list").html('');
        $("#back-button").hide();
        $("#title").text("Updating...");
    },

    hideUpdateScreen: function() {
        controller.listLanguages();
    },

    displayInfoScreen: function(languageId, languageName, info, map) {
        $("#info-screen").html('');
        $("#info-button").hide();
        $("#language-list").hide();
        $("#expression-list").hide();
        $("#info-screen").append('<div class="info-text">' + atob(info) + '</div>' +
            '<img src="' + cordova.file.dataDirectory + map + '" style="width: 80%; height: auto; display: block; margin-left: auto; margin-right: auto; margin-top: 10px;">');
        $("#info-screen").show();
        $("#back-button").show();
        $( "#back-button").unbind( "click" );
        $("#back-button").click(function() {
            controller.listExpressions(languageId, languageName, info, map);
        });
    },

    playSound: function(fileName) {
        audioElement.pause();
        audioElement = document.createElement('audio');
        audioElement.setAttribute('src', cordova.file.dataDirectory + fileName);
        audioElement.play();
    }
};

app.initialize();