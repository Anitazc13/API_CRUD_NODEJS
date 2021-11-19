//Dependences to use and libraries
const http=require('http');
const express=require('express');

const app=express(); // to create routes and api
const sqlite3=require('sqlite3').verbose();
const path=require('path');

//settings
app.set('port',process.env.PORT || 5000)

//Resources
app.use(express.static(__dirname+'/'))

//Configuration of servidor
app.use(express.json());
app.set('json spaces',2);
//Starting the server
app.set("view engine","ejs");

app.set("views", path.join(__dirname,"/"));
app.use(express.urlencoded({extended:false})); // support the data
app.listen(5000);
console.log("Server is running"); 
console.log(`Server is running now in the port ${app.get('port')}`);

//Base de Datos
const db_name=path.join(__dirname,"db","base.db");
const db=new sqlite3.Database(db_name, err =>{ 
if (err){
	return console.error(err.message);
}else{
	console.log("Success conexion");
}
})

const sql_DROP="DELETE FROM STUDENTS";
db.run(sql_DROP,err=>{
	if (err){
	return console.error(err.message);
}else{
	console.log("The table for students was dropped");
}
})

//Create the table
const sql_create="CREATE TABLE IF NOT EXISTS STUDENTS(ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, NAME VARCHAR(100) NOT NULL, SALARY REAL, JOB_NAME VARCHAR(100));";
db.run(sql_create,err=>{
	if (err){
	return console.error(err.message);
}else{
	console.log("The table for students was created succesfully");
}
})

let students=[
    {"name": "David", "salary": 2500, "job_name":"Tech Lead"},
    {"name": "Aldo", "salary": 2300, "job_name":"Back End Developer"},
    {"name": "Natz", "salary": 1800, "job_name":"Full Stack Developer"},
    {"name": "Ana", "salary": 1600, "job_name":"Front End Developer"},
    {"name": "Rodri", "salary": 2150, "job_name":"Front End Developer"},
    {"name": "Mindy", "salary": 2500, "job_name":"Designer UX/UI"},
    {"name": "Eder", "salary": 2000, "job_name":"Back End Developer"},
    {"name": "Erick", "salary": 2100, "job_name":"Full Stack Developer"},
    {"name": "Andres", "salary": 2500, "job_name":"Tech Lead"},
    {"name": "Wences", "salary": 5500, "job_name":"Instructor and Mentor"}
]

    for (let i=0; i< students.length; i++){
         db.run('INSERT INTO STUDENTS(Name, Salary, Job_name) VALUES(?, ?, ?)',students[i]["name"],students[i]["salary"],students[i]["job_name"],(err,rows)=>{
         if(err){
            throw err;
         }
          console.log(`Insert Success of student ${students[i]["name"]}`);
     })
    }

//get all the students
app.get("/api/students",(req,res)=>{
    const sql= 'SELECT * FROM STUDENTS';
    let array = []
    db.all(sql, [], (err, rows) => {
        if (err) {
        throw err;
        }
        rows.forEach((row) => {
            array.push(row);
            });
            res.json(array);
    });
}) 

//show an student by id
app.get("/api/students/:id",(req,res)=>{
    const sql= 'SELECT * FROM STUDENTS WHERE ID=?';
    let params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            throw err;
        }
        res.json(row);
    });
}) 


//delete an student by id
app.delete("/api/students/:id", (req, res) => {
    db.run(
        'DELETE FROM STUDENTS WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                throw err;
            }
            res.json({"message":"deleted"})
    });
})

//create an student
app.post('/api/students',(req,res)=>{
	const sql="INSERT INTO STUDENTS(NAME, SALARY, JOB_NAME) VALUES(?,?,?)";
	const newStudent=[req.body.NAME, req.body.SALARY, req.body.JOB_NAME];
	db.run(sql, newStudent, err =>{
	if (err){
                throw err;
			}
			else{
			res.redirect("/api/students");
		}
	})
});

//update a row in student
app.patch("/api/students/:id", (req, res, next) => {
    let data = {
        name: req.body.name,
        salary: req.body.salary,
        job_name : req.body.job_name 
    }
    db.run(
        `UPDATE students set 
           name = COALESCE(?,NAME), 
           salary = COALESCE(?,salary), 
           job_name = COALESCE(?,job_name) 
           WHERE id = ?`,
        [data.NAME, data.SALARY, data.JOB_NAME, req.params.id],
        function (err, result) {
            if (err){
                throw err;
            }
            res.redirect("/api/students");
    });
})
