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
        db = window.openDatabase("Database", "1.0", "BabelAppDb", 200000);

        // database.connectDb(function(dbResult) {
        //     if(dbResult === 0) {
        //         requestApi.doRequest(function(responseValue, updateUrl) {
        //             if(responseValue === 100) {
        //                 console.log("Update needed");
        //                 console.log("Update URL: " + updateUrl);
        //             } else if(responseValue === 200) {
        //                 console.log("Update is not needed");
        //             } else {
        //                 console.log("An error occured, carry on");
        //             }
        //         });                
        //     }
        // });

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
                $( "#language-list" ).empty();
                $( "#back-button" ).hide();
                $( "#title" ).text("Languages");
                for (var i = 0; i < resultSet.rows.length; i++) {
                    var row = resultSet.rows.item(i);
                    var name = resultSet.rows.item(i).name;
                    var id = resultSet.rows.item(i).id;
                    var container = '<div class="list-item" ontouchend="controller.listExpressions(\'' + id + '\', \'' + name + '\')">';
                    console.log(container);
                    var listLabel = '<div class="label">';
                    var arrowIcon = '<img src="img/arrow-icon.png" class="arrow-icon" alt="Arrow">';
                    var divEnd = '</div>';
                    $( "#language-list" ).append(container +
                        listLabel + name +
                        divEnd +
                        arrowIcon +
                        divEnd );
                }
            } else {
                console.log("Error occurred: ListLanguages in controller");
            }
        });
    },

    listExpressions: function(languageId, languageName) { 
        database.getExpressions(languageId, function(resultSet) {
            if(resultSet !== -1) {
                $( "#language-list" ).empty();
                $( "#back-button" ).show();
                $( "#back-button" ).click(function() {
                    controller.listLanguages();
                });
                $( "#title" ).text(languageName);
                for (var i = 0; i < resultSet.rows.length; i++) {
                    var row = resultSet.rows.item(i);
                    var english = resultSet.rows.item(i).english;
                    var translation = resultSet.rows.item(i).translation;
                    var container = '<div class="list-item">';
                    var listLabel = '<div class="label">';
                    var arrowIcon = '<img src="img/arrow-icon.png" class="arrow-icon" alt="Arrow">';
                    var divEnd = '</div>';
                    console.log(english);
                    $( "#language-list" ).append(container +
                        listLabel + english + " - " + translation +
                        divEnd +
                        arrowIcon +
                        divEnd );
                } 
            } else {
                console.log("Error occurred: listExpressions in controller");
            }
        });
    }
};

app.initialize();