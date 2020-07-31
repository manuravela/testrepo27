var path = require('path');        

//const port = process.env.PORT ||9000;   
//const app = express();

var express = require('express'); // Get the module
var app = express(); // Create express by calling the prototype in var express

//Set the base path to the angular-test dist folder
app.use(express.static(path.join(__dirname, 'dist')));

//Any routes will be redirected to the angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});



var fs = require("fs");
const bodyParser = require('body-parser');
const mysql = require('mysql')


const options = {
   host: 'localhost',
   user: 'root',
   password: 'root',
   database: 'studcertdb'

}

const connection = mysql.createConnection(options)

connection.connect(function(err) {
   if (err) throw err;
   console.log("Connected!");
 });

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
   res.header("content-type", "application/json");
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");   
  next();
});

//////////////////////////////////// Student DB /////////////////////////


app.get('/students', function (req, res) {   
   connection.query("SELECT * FROM  `studcertdb`.`student` ", function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})


app.post('/students', function (req, res) {   
   var studentID = req.body.studentID;
   var firstname = req.body.firstname;
   var lastname = req.body.lastname;
   var email = req.body.email;

   console.log ("post");
   console.log(req.body);

   connection.query("INSERT INTO `studcertdb`.`student` (`firstname`, `lastname`, `email`) VALUES ('"+firstname+"', '"+lastname+"',  '"+email+"'); ", function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})


app.delete('/students/:studentID', function (req, res) {
   connection.query("DELETE FROM  `studcertdb`.`student`  WHERE studentID = " + req.params.studentID, function (err, result, fields) { //added studentID
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})

app.put('/students/:studentID', function (req, res) {
   console.log ("put");
   console.log(req.body);
 
    connection.query("UPDATE  `studcertdb`.`student` set firstname = '"+req.body.firstname+ "' , lastname ='" +req.body.lastname + "' where studentID = " + req.params.studentID, function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })

app.get('/students/:studentID', function (req, res) {
   console.log("student ID: "+ req.params.studentID);
   connection.query("SELECT * FROM `studcertdb`.`student` where studentID = " + req.params.studentID, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
    });
})


//////////////////////////////////// Entrollment DB /////////////////////////

app.get('/enrollment', function (req, res) {   
    connection.query("SELECT * FROM  `studcertdb`.`enrollment` ", function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })

 app.get('/enrollment/:studentID', function (req, res) {  
   // console.log(req.params.studentID);
   connection.query("SELECT course_courseID FROM  `studcertdb`.`enrollment` where student_studentID = " + req.params.studentID, function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result));
      
    });
})

app.get('/enrollment/course/:courseID', function (req, res) {  
    console.log("Course ID: "+req.params.course_courseID);
   connection.query("SELECT coursecompleted FROM  `studcertdb`.`enrollment` where course_courseID = " + req.params.courseID, function (err, result, fields) {
      console.log(req.params.courseID);
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
      
    });
})


app.delete('/enrollment/:student_studentID:course_courseID', function (req, res) {
   console.log("Course ID: "+req.params.course_courseID);
    console.log("studentID: "+ req.params.student_studentID);
   connection.query("DELETE FROM  `studcertdb`.`enrollment`  WHERE course_courseID = " + req.params.course_courseID + " AND student_studentID= "+ req.params.student_studentID, function (err, result, fields) { //added studentID
      if (err) throw err;
      res.end(JSON.stringify(result));
      console.log(result);
    });
})



 
 app.post('/enrollment', function (req, res) {   
    var coursecompleted = req.body.coursecompleted;
    var student_studentID = req.body.student_studentID;
    var course_courseID = req.body.course_courseID;
 
    console.log ("post");
    console.log(req.body);
 
    connection.query("INSERT INTO `studcertdb`.`enrollment` (`coursecompleted`, `student_studentID`, `course_courseID`) VALUES ('"+coursecompleted+"', '"+student_studentID+"',  '"+course_courseID+"'); ", function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })



//////////////////////////////////// Course DB /////////////////////////

app.get('/course', function (req, res) {   
    connection.query("SELECT * FROM  `studcertdb`.`course` ", function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })



 app.post('/course', function (req, res) {   
    var courseID = req.body.courseID;
    var coursename = req.body.coursename;
    var coursestartdate = req.body.coursestartdate;
    var courseenddate = req.body.courseenddate;

 
    console.log ("post");
    console.log(req.body);
 
    connection.query("INSERT INTO `studcertdb`.`course` (`courseID`, `coursename`, `coursestartdate` , `courseenddate`) VALUES ('"+courseID+"', '"+coursename+"',  '"+coursestartdate+"',  '"+courseenddate+"'); ", function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })

 
app.get('/course/:courseID', function (req, res) {
   connection.query("SELECT * FROM `studcertdb`.`course` where courseID = " + req.params.courseID, function (err, result, fields) {
      console.log(req.params.courseID);
      console.log(result);
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})


app.get('/courseenddate/:courseID', function (req, res) {
   connection.query("SELECT courseenddate FROM `studcertdb`.`course` where courseID = " + req.params.courseID, function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})


app.delete('/course/:courseID', function (req, res) {
   connection.query("DELETE FROM  `studcertdb`.`course` WHERE courseID = " + req.params.courseID, function (err, result, fields) { //added studentID
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})


//////////////////////////////////// Certgeneratorlog DB /////////////////////////

app.get('/certgeneratorlog', function (req, res) {   
    connection.query("SELECT * FROM  `studcertdb`.`certgeneratorlog` ", function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })
   
 app.get('/certificate/certgeneratorlog/:student_studentID', function (req, res) {   
   connection.query("SELECT CertificateURL FROM  `studcertdb`.`certgeneratorlog` WHERE student_studentID = "+ req.params.student_studentID, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
    });
})

app.get('/certgeneratorlog/studentInfo/:student_studentID', function (req, res) {   
   connection.query("SELECT * FROM  `studcertdb`.`certgeneratorlog` WHERE student_studentID = "+ req.params.student_studentID, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
    });
})


 
 app.post('/certgeneratorlog', function (req, res) {  
    //var GenerateDate = req.body.GenerateDate; 
    var CertificateURL = req.body.CertificateURL;
    var student_studentID = req.body.student_studentID;
    var course_courseID = req.body.course_courseID;
 
    console.log ("post");
    console.log(req.body);

    connection.query("INSERT INTO `studcertdb`.`certgeneratorlog` (`CertificateURL`, `student_studentID`, `course_courseID`) VALUES ('"+CertificateURL+"', '"+student_studentID+"',  '"+course_courseID+"'); ", function (err, result, fields) {
       if (err) throw err;
       console.log(result);
       res.end(JSON.stringify(result));
     });
 })
//////////////////////////////////// Studentusers DB /////////////////////////

app.get('/userinfo', function (req, res) {   
    connection.query("SELECT * FROM  `studcertdb`.`users` ", function (err, result, fields) {
       if (err) throw err;
       console.log(result);
       res.end(JSON.stringify(result));
     });
 })
 
 app.get('/admin/username', function (req, res) {   
   connection.query("SELECT username FROM  `studcertdb`.`users` ", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
    });
})
 
 app.post('/users', function (req, res) {   
    var ID = req.body.ID;
    //var firstname = req.body.firstname;
    //var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    //var active = req.body.active;

 
    console.log ("post users");
    console.log(req.body);
 // (`student_studentID`,`firstname`, `lastname`, `username`,`password`, `active`) VALUES ('"+firstname+"', '"+lastname+"',  '"+username+"', '"+password+"', '"+active+"'); ", function (err, result, fields) {
    connection.query("INSERT INTO `studcertdb`.`users` (`ID`, `username`, `password`) VALUES ('"+ID+"', '"+username+"', '"+password+"'); ", function (err, result, fields) {
       if (err) throw err;
       console.log(result);
       res.end(JSON.stringify(result));
     });
 })

 app.put('/users/:username:password', function (req, res) {
   console.log ("put users");
   console.log(req.params.password);
 
    connection.query("UPDATE `studcertdb`.`users` set password=" + req.params.password + " WHERE username = " + req.params.username, function (err, result, fields) {
       if (err) throw err;
       console.log(result);
       res.end(JSON.stringify(result));
     });
 })


//////////////////////////////////// Adminusers DB /////////////////////////


//Starting server on port 8081
//app.listen(port, () => {
//    console.log('Server started!');
//    console.log(port);
//});

var server = app.listen(9000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})




