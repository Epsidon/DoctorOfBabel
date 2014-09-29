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
* Implmenet the controllers 
* Setup bootstrap for the frontend
