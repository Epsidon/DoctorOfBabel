# Doctor of Babel

Project is structured into two parts. The first is the phonegap app and the Nodejs server that is under the babelserver directory. 

TODO: Phonegap explanation

### Backend Server

The server utilizes Node.js to build the backend along with the Express framework to handle the routing. To run this project Node.js is required to be installed from the [official website](http://nodejs.org/download/). Alongside Node, it comes bundled with npm the package manager. 

To run the project simply navigate to the babelserver directory and type
```bash
$ npm install
``` 

This will use the package.json file to install all the required dependencies. After that type
```bash
$ npm start
```

To start the webserver. Currently defaults to port 3000, but that can be changed from babelserver/bin/www file.

To get the database up and running, it requires installing [MongoDB](http://www.mongodb.org/downloads) first. Follow the instructions there to run it. Currently this line of code in babelserver/app.js
```js
mongoose.connect('mongodb://localhost:27017/babel');
```
dictates where the database is hosted. Eventually will be replaced with a way to detect development or production environments.  


### Server Structure

```
/bin     - Startup scripts for the webserver
/models  - Holds the database models
/public  - Static files such as images, css and js
/routes  - Acts as controllers for routing
/views   - Templating pages and layouts
app.js   - Configuration and starting point
```

# TODO

#### Yousif
* Finish designing the backend API
* Implement the controllers 
* Setup bootstrap for the frontend


# Features

A tentative overview of both the mobile app and the website and what they need to do at the basic level.


### Website

* Responsive design, resizing the web browser or viewing the website on different devices such as tablets or phones will show appropriately layout design that fits the screen. This can be implemented using Twitter Bootstrap and will be heavily themed to fit the website.
* The design of the mobile view of the website will have to match the design of the Phonegap app. 
* The website will grab the languages and other info directly from the database built using MongoDB.
* Add an admin feature to allow editing of the languages. This can be implemented using a subdomain such as admin.doctorofbabel.org or using doctorofbabel.org/admin
* The languages will be edited using a form that lists the English expressions, the user will enter the translation and upload an .mp3 file for each expression. 
* A search bar with an autocomplete feature is a possible idea to implement. This will be used for both the web app and mobile app. 


### Phonegap App

* The app will target both Android and Iphone. Could possibly target other devices such as Windows Phone or Blackberry
* The design will be the same for both platforms, however it is possible to have some UI changes if it's necessary.
* The app upon launching and if Wi-Fi is enabled it will call the server and check for new updates available. If there are, download the new languages/modifications and cache them to the app for offline using. 
* Consider different ways of listing the languages instead of just alphabetical order. Grouping them by continents is a possibility.
* Search bar autocomplete feature that tries to match best language. 


# Libraries/Frameworks

Lists of libraries and frameworks that will be used. Also some that might be worht investigating to see if it's worth using them

* [Node.js](http://nodejs.org/) - The basica technology powering the server.
* [Express](http://expressjs.com/) - A web application framework that will help with the routing.
* [Twitter Bootstrap](http://getbootstrap.com/) - The frontend responsive framework that can be used as a base for the web app. 
* [Bower](http://bower.io/) - Consider using this. Bower helps manage frontend libraries such as jquery or twitter bootstrap and keep them up to date automatically instead of manually downloading the new updates.
* [jQuery](http://jquery.com/) - Much needed library to manipulate the DOM for the web app.
* [jQuery Mobile](http://jquerymobile.com/) - Similar to above, but will help us for the mobile web app part.
* [Ionic](http://ionicframework.com/) - This UI framework could be used to build the Phonegap app. Only requirement is that it supports Android 4.0+ and iOS 6+
* [Mobile Angular UI](http://mobileangularui.com/) - A useful library using both AngularJS and Bootstrap to provide a lot of mobile friendly features that are missing from Bootstrap. 
* [Mongoose](http://mongoosejs.com/) - An ORM for MongoDB that we will be using. There are other more lightweight alternatives, but this one is officially backed by MongoDB team and has a lot of documentation and available help online.
