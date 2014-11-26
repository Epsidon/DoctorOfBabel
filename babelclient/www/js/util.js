var downloadUri;
var jsonScheme;

var requestApi = {

    doRequest: function(callback) {
        // callback values:
        // 100: updates found, get ready to download
        // 200: no update required
        // 300: error encountered somewhere, try again
        // 400: request error
        database.getLocalVersion(function(versionNo) {
            var url = "https://doctorofbabel.herokuapp.com/api/version/" + versionNo;
            $.getJSON(url, function(data, status) {
                if (status === 'success') {
                    if (data["status"] === 100) {
                        callback(data["status"], data["link"]);
                        downloadUri = "http://alazgulec.net/scheme.zip";
                        requestApi.downloadFile();
                    } else {
                        callback(data["status"], null);
                    }
                } else {
                    callback(400, null);
                }
            }).fail(function() {
                //callback should return error
                callback(400, null);
            });
        });
    },

    downloadFile: function() {
        console.log('downloadFile');
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT,
            0,
            requestApi.onRequestFileSystemSuccess,
            requestApi.fail
        );
    },

    onRequestFileSystemSuccess: function(fileSystem) {
        console.log('onRequestFileSystemSuccess');
        fileSystem.root.getFile(
            'dummy.html', {
                create: true,
                exclusive: false
            },
            requestApi.onGetFileSuccess,
            requestApi.fail
        );
    },

    onGetFileSuccess: function(fileEntry) {
        console.log('onGetFileSuccess!');
        //    var path = fileEntry.toURL().replace('dummy.html', '');
        var path = 'cdvfile://localhost/persistent' + '/BabelClientFiles/';
        var zipPath = path + 'scheme.zip'
        var fileTransfer = new FileTransfer();
        fileEntry.remove();

        fileTransfer.download(
            downloadUri,
            path + 'scheme.zip',
            function(file) {
                console.log(file.toURL());
                zip.unzip(zipPath, path, function(result) {
                    if (result === 0) {
                        $.getJSON(path + 'scheme.json', function(json) {
                            database.addLanguages(json["languages"], function(result) {
                                if(result === 0) {
                                    database.addExpressions(json["expressions"]);
                                }
                            });
                        });
                    } else if (result === -1) {
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


    fail: function(evt) {
        console.log(evt.target.error.code);
    }
};

var database = {

    // LANGUAGE TABLE: id, name, info, map, version
    // EXPRESSION TABLE: id, english, translation, audio, language, pronunciation, version
    // VERSION TABLE: id, version_no

    connectDb: function(callback) {
        db.transaction(function(tx) {
            // tx.executeSql('DROP TABLE LANGUAGE');
            // tx.executeSql('DROP TABLE EXPRESSION');
            // tx.executeSql('DROP TABLE VERSION');

            tx.executeSql('CREATE TABLE IF NOT EXISTS LANGUAGE (id TEXT NOT NULL PRIMARY KEY, name TEXT NOT NULL, info TEXT, map TEXT, version INTEGER)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS EXPRESSION (id TEXT NOT NULL PRIMARY KEY, english TEXT NOT NULL, translation TEXT NOT NULL, audio TEXT, language TEXT NOT NULL, pronunciation TEXT, version INTEGER)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS VERSION (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, version_no INTEGER NOT NULL)');
            // tx.executeSql('INSERT INTO EXPRESSION (id, english, translation, audio, language, pronunciation, version) VALUES ("qq112", "english 5", "translation 5", "/eng1.mp3", "zJzzSgPn", "pronun", 0)');
            // tx.executeSql('INSERT INTO EXPRESSION (id, english, translation, audio, language, pronunciation, version) VALUES ("qq123", "english 6", "translation 6", "/eng2.mp3", "zJzzSgPn", "pronun", 0)');
            // tx.executeSql('INSERT INTO EXPRESSION (id, english, translation, audio, language, pronunciation, version) VALUES ("qq134", "english 7", "translation 7", "/eng3.mp3", "zJzzSgPn", "pronun", 0)');
            // tx.executeSql('INSERT INTO EXPRESSION (id, english, translation, audio, language, pronunciation, version) VALUES ("qq145", "english 8", "translation 4", "/eng4.mp3", "zJzzSgPn", "pronun", 0)');
            tx.executeSql('INSERT INTO VERSION (version_no) VALUES (0)');


        }, 
        function(tx, err) {
            console.log("Error processing SQL: " + err.message);
            // In case db fails initializing, return -1
            callback(-1);
        }, 
        function() {
            // 
            alert("database created!");
            database.getLocalVersion();
            callback(0);
        });
    },

    initiateDb: function(tx) {

    },

    errorCallback: function(tx, err) {
        alert("Error processing SQL: " + err);

    },

    successCallback: function() {

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

    getLanguages: function(callback) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM LANGUAGE', [], function(tx, resultSet) {
                callback(resultSet);
            }, function(tx, err) {
                console.log("getLanguages error: " + err.message);
                callback(-1);
            });
        });
    },

    getExpressions: function(languageId, callback) {
        console.log("languageId: " + languageId);
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM EXPRESSION WHERE language = ?', [languageId], function(tx, resultSet) {
                callback(resultSet);
            }, function(tx, err) {
                console.log("getExpressions error: " + err.message);
                callback(-1);
            });
        });
    },

    getLocalVersion: function(callback) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM VERSION ORDER BY `id` DESC LIMIT 1;', [], function(tx, resultSet) {
                var lastRow = resultSet.rows.item(0);
                var version_no = lastRow.version_no;
                console.log("Version Number: " + version_no);
                callback(version_no);
            }, function(tx, err) {
                callback(-1);
            });
        });
    },

    //TBD
    setLocalVersion: function(callback) {
        callback(true);
    },

    // version attribute is missing
    addLanguages: function(languages, callback) {
        db.transaction(function(tx) {
            for (var i = languages.length - 1; i >= 0; i--) {
                tx.executeSql(
                    'INSERT INTO LANGUAGE (id, name, info, map) VALUES (?, ?, ?, ?)', [languages[i]["_id"], languages[i]["name"], languages[i]["info"], languages[i]["map"]],
                    function() {
                        console.log("success");
                        callback(0);
                    },
                    function(er, err) {
                        console.log("unsuccess: " + err.message);
                        callback(-1);
                    }
                );
            };
        });
    },

    addExpressions: function (expressions) {
        db.transaction(function(tx) {
            for (var i = expressions.length - 1; i >= 0; i--) {
                tx.executeSql(
                    'INSERT INTO EXPRESSION (id, english, translation, audio, language, pronunciation) VALUES (?, ?, ?, ?, ?, ?)', 
                    [expressions[i]["_id"], expressions[i]["english"], expressions[i]["translation"], expressions[i]["audio"], expressions[i]["language"], expressions[i]["pronunciation"]],
                    function() {
                        console.log("expressions success");
                    },
                    function(er, err) {
                        console.log("expressions unsuccess: " + err.message);
                    }
                );
            };
        });
    },
};

var util = {
    getConnection: function(callback) {
        var networkState = navigator.network.connection.type;
        if (networkState === 'Unknown connection' || networkState === 'Cell 2G connection' || networkState === 'Unknown connection') {
            callback(false);
        } else {
            callback(true);
        }
    }
};