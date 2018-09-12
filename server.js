//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

//Setting up server
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

//Initiallising connection string
var dbConfig = {
    user:  "myuser",
    password: "xxx",
    server: "djibouti.database.windows.net",
    database: "PhantomPass",
    options : {
	encrypt : true
    }
};

//Function to connect to database and execute query
var executeQuery = function(res, query) {
  sql.connect(dbConfig, function (err) {
    if (err) {
      console.log("Error while connecting database :- " + err);
      res.send(err);
      sql.close();
    } else {
      // create Request object
      var request = new sql.Request();

      // query to the database
      request.query(query, function (err, result) {
        if (err) {
	  console.log("Error while querying database :- " + err);
	  res.send(err);
	  sql.close();
	} else {
	  res.send(result);
	  sql.close();
	}
     });
    }
  });
}

//GET API
app.get("/Users", function(req, res) {
  var query = "SELECT * FROM [Users]";
  executeQuery (res, query);
});

//GET API
app.get("/Users/:id", function(req, res) {
  var query = "SELECT * FROM [Users] WHERE Id=" + req.params.id;
  executeQuery (res, query);
});


//POST API
// EMAIL
// PHONE
// PASSWORD
// NAME
// BIRTH_MONTH
// BIRTH_YEAR
// ADDRESS
// CITY
// STATE
// ZIPCODE
// DELETED
// VERSION
// CREATEDAT
// UPDATEDAT
app.post("/Users", function(req , res) {
  var query = "INSERT INTO [Users] \
    ([email],[phone]) \
    VALUES ('"
    + req.body.email + "','"
    + req.body.phone + "')";

  executeQuery (res, query);
});

//PUT/PATCH API
app.put("/Users/:id", function(req, res) {
  var query = "UPDATE [Users] SET \
    email='" + req.body.email
    + "', phone='" + req.body.phone
    + "' WHERE Id=" + req.params.id;
  executeQuery (res, query);
});

// DELETE API
app.delete("/Users/:id", function(req , res) {
  var query = "DELETE FROM [Users] WHERE Id=" + req.params.id;
  executeQuery (res, query);
});
