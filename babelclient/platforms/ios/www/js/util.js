var requestApi = {
    
    //Not working - needs to be resolved
    //This function is to return a callback method
    //If an update is available, than return 0
    //Else, -1
    doRequest: function() {
        database.getLocalVersion(function(version_no) { 
            alert("version: " +  version_no);
            var url = "localhost:8086/api/version/" + version_no;
            $.getJSON(url, function(json) {
                console.log(json);
            });
        });
    },

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
        tx.executeSql('CREATE TABLE IF NOT EXISTS VERSION (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, version_no INTEGER NOT NULL)');
    },

    errorCallback: function(tx, err) {
        alert("Error processing SQL: " + err);

    },

    successCallback: function() {
        alert("database created!");
        database.getLocalVersion();
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
    },

    getLocalVersion: function(callback) {
        db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM VERSION ORDER BY `id` DESC LIMIT 1;', [], function (tx, resultSet) {
            var lastRow = resultSet.rows.item(resultSet.rows.length-1);
            var version_no = lastRow.version_no;
            callback(version_no);
        }, function(tx, err) {
            console.log("getLanguages error: " + err);
            callback(-1);
            });
        });
    },

    //TBD
    setLocalVersion: function(callback) {
        callback(true);
    }
};
