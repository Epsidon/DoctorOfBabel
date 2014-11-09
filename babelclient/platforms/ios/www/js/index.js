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
        app.receivedEvent('deviceready');
        db = window.openDatabase("Database", "1.0", "BabelAppDb", 200000);
        requestApi.downloadFile();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var requestApi = {
    
    downloadFile: function(){
        console.log('downloadFile');
        window.requestFileSystem(
                                 LocalFileSystem.PERSISTENT,
                                 0,
                                 requestApi.onRequestFileSystemSuccess,
                                 requestApi.fail
                                 );
    },
        
    onRequestFileSystemSuccess: function(fileSystem){
        console.log('onRequestFileSystemSuccess');
        fileSystem.root.getFile(
                                'dummy.html',
                                {create: true, exclusive: false},
                                requestApi.onGetFileSuccess,
                                requestApi.fail
                                );
    },
    
    onGetFileSuccess: function(fileEntry){
        console.log('onGetFileSuccess!');
        //    var path = fileEntry.toURL().replace('dummy.html', '');
        var path = 'cdvfile://localhost/persistent'+ '/BabelClient/';
        var fileTransfer = new FileTransfer();
        fileEntry.remove();
        
        fileTransfer.download(
                              'http://www.colorado.edu/conflict/peace/download/peace.zip',
                              path + 'peace.zip',
                              function(file) {
                                zip.unzip(path + 'peace.zip', path, function(result) {
                                    if(result===0) {
                                        alert("worked!");
                                        database.connectDb();
                                    } else if (result===-1) {
                                        alert("failed");
                                    }
                                });

                              alert('download complete: ' + file.toURL());
                              },
                              function(error) {
                                alert('download error source ' + error.source);
                                alert('download error target ' + error.target);
                                alert('upload error code: ' + error.code);
                              }
                              );
        
    },
    
    
    fail: function(evt){
        console.log(evt.target.error.code);
    }   
    
};

var database = {

    connectDb: function () {
        db.transaction(database.initiateDb, database.errorCallback, database.successCallback);
    },

    initiateDb: function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS LANGUAGE (id INTEGER NOT NULL PRIMARY KEY, name TEXT NOT NULL, info TEXT, map TEXT, version INTEGER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS EXPRESSION (id INTEGER NOT NULL PRIMARY KEY, english TEXT NOT NULL, translation TEXT NOT NULL, audio TEXT, language TEXT NOT NULL, pronunciation TEXT, version INTEGER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS VERSION (id INTEGER NOT NULL PRIMARY KEY, version_no INTEGER NOT NULL)');
    },

    errorCallback: function(tx, err) {
        alert("Error processing SQL: " + err);

    },

    successCallback: function() {
        alert("database created!");
    },

    isTableExists: function(tx, tableName, callback) {
        tx.executeSql('SELECT * FROM LANGUAGES', [], function(tx, resultSet) {
            if (resultSet.rows.length <= 0) {
                callback(false);
            } else {
                callback(true);
            }
        }, function(err) {
            callback(false);
        });
    },

    getLanguages: function() {
        db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM LANGUAGE', [], function (tx, resultSet) {
            for ( var i = 0; i < resultSet.rows.length; i++) {
                var row = resultSet.rows.item(i);
                var name = resultSet.rows.item(i).name; //supposing there is an id in your result
                console.log('Language name: ' + name);
            }
        }, function(tx, err) {
            console.log("getLanguages error: " + err);
            return null;
            });
        });
    }
};


app.initialize();