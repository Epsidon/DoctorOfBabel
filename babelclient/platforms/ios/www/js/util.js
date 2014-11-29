var downloadUri;
var jsonScheme;
var downloadPath;
var recentVersion;

var requestApi = {

    doRequest: function(callback) {
        // callback values:
        // 100: updates found, get ready to download
        // 200: no update required
        // 300: error encountered somewhere, try again
        // 400: request error
        database.getLocalVersion(function(versionNo) {
            var url = "http://104.131.29.43/api/version/" + versionNo;
            $.getJSON(url, function(data, status) {
                if (status === 'success') {
                    if (data["status"] === 100) {
                        recentVersion = data["version"];
                        downloadUri = data["link"];
                        callback(data["status"], data["link"], data["version"]);
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
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
            var zipPath = dir.toInternalURL() + 'scheme.zip';
            console.log('ZIP PATH' + zipPath);
            var fileTransfer = new FileTransfer();
            fileTransfer.download(downloadUri, zipPath, function(file) {
                console.log(file.toInternalURL());
                zip.unzip(zipPath, cordova.file.dataDirectory, function(result) {
                    if (result === 0 ) {
                        $.getJSON(cordova.file.dataDirectory + 'scheme.json', function(json) {
                            database.addLanguages(json["languages"], function(result) {
                                if(result === 0) {
                                    database.addExpressions(json["expressions"], function(result) {
                                        if(result === 0) {
                                            database.setLocalVersion();
                                            console.log("pushed the language properly!");
                                        }
                                    });
                                }
                            });
                        });
                        alert('zip extraction complete');
                    } else if (result === -1) {
                        alert('zip extraction failed');
                    }
                });
                alert('DOWNLOAD COMPLETE ' + file.toURL());
            }, function(error) {
                alert('download error source ' + error.source);
                alert('download error target ' + error.target);
                alert('upload error code: ' + error.code);
            });     
        }, function(error) {
            console.log('SYSTEM ERROR');
        });
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
                // tx.executeSql('INSERT INTO VERSION (version_no) VALUES (0)');


            },
            function(tx, err) {
                console.log("Error processing SQL: " + err.message);
                // In case db fails initializing, return -1
                callback(-1);
            },
            function() {
                alert("database created!");
                callback(0);
            });
    },

    createDb: function(callback) {
        db.transaction(function(tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS LANGUAGE (id TEXT NOT NULL PRIMARY KEY, name TEXT NOT NULL, info TEXT, map TEXT, version INTEGER, removed INTEGER)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS EXPRESSION (id TEXT NOT NULL PRIMARY KEY, english TEXT NOT NULL, translation TEXT NOT NULL, audio TEXT, language TEXT NOT NULL, pronunciation TEXT, version INTEGER, removed INTEGER)');
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
                alert("database created!");
                callback(0);
            });        
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
            tx.executeSql('SELECT * FROM LANGUAGE WHERE removed = 0', [], function(tx, resultSet) {
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
            tx.executeSql('SELECT * FROM EXPRESSION WHERE language = ? AND removed = 0', [languageId], function(tx, resultSet) {
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
                if(resultSet.rows.length > 0) {
                    var lastRow = resultSet.rows.item(0);
                    var version_no = lastRow.version_no;
                    console.log("Version Number: " + version_no);
                    callback(version_no);
                } else {
                    callback(-1);
                }
            }, function(tx, err) {
                console.log("An error occured when retreiving the local version (getLocalVersion) :" + err.message);
                callback(-1);
            });
        });
    },

    // Final method. This method will finalize the process of update.
    setLocalVersion: function() {
        db.transaction(function(tx) {
                tx.executeSql(
                    'INSERT INTO VERSION (version_no) VALUES (?)', [recentVersion],
                    function() {
                        console.log("version number updated succesfully");
                        controller.hideUpdateScreen();
                    },
                    function(er, err) {
                        console.log("version number update unsuccesful: " + err.message);
                    }
                );
        });
    },

    // version attribute is missing
    addLanguages: function(languages, callback) {
        var success = true;
        db.transaction(function(tx) {
            for (var i = languages.length - 1; i >= 0; i--) {
                var isRemoved = 0;
                if(languages[i]["removed"] === true) {
                    isRemoved = 1;
                }
                tx.executeSql(
                    'INSERT OR REPLACE INTO LANGUAGE (id, name, info, map, removed) VALUES (?, ?, ?, ?, ?)', [languages[i]["_id"], languages[i]["name"], languages[i]["info"], languages[i]["map"], isRemoved],
                    function() {
                        console.log("success adding expressions");
                    },
                    function(er, err) {
                        console.log("unsuccess: " + err.message);
                        callback(-1);
                    }
                );
            };
            callback(0);
        });
    },

    addExpressions: function(expressions, callback) {
        db.transaction(function(tx) {
            for (var i = expressions.length - 1; i >= 0; i--) {
                var isRemoved = 0;
                if(expressions[i]["removed"] === true) {
                    isRemoved = 1;
                }
                tx.executeSql(
                    'INSERT OR REPLACE INTO EXPRESSION (id, english, translation, audio, language, pronunciation, removed) VALUES (?, ?, ?, ?, ?, ?, ?)', [expressions[i]["_id"], expressions[i]["english"], expressions[i]["translation"], expressions[i]["audio"], expressions[i]["language"], expressions[i]["pronunciation"], isRemoved],
                    function() {
                        console.log("expressions success");
                    },
                    function(er, err) {
                        console.log("expressions unsuccess: " + err.message);
                        callback(-1);
                    }
                );
            };
            callback(0);
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