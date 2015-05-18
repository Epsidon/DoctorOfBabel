#!/bin/bash

cd babelclient
cordova build android
cordova build ios
if [ -f "my-release-key.keystore" ];then
echo "Clé existante";
else
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
fi
cd platforms/android
ant release
cd bin
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../../my-release-key.keystore CordovaApp-release-unsigned.apk alias_name
jarsigner -verify -verbose -certs CordovaApp-release-unsigned.apk
zipalign -v 4 CordovaApp-release-unsigned.apk DocteurOfBabel.apk
mv -f DocteurOfBabel.apk ../
cd ../