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
        downloadAndExtract.downloadFile();
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

var downloadAndExtract = {
    
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
        var path = 'cdvfile://localhost/persistent'+ '/BabelClient/';
        var fileTransfer = new FileTransfer();
        fileEntry.remove();
        
        fileTransfer.download(
                              'http://download.thinkbroadband.com/5MB.zip',
                              path + '5MB.zip',
                              function(file) {
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


app.initialize();