const express = require('express');
const Joi = require('joi');
const app = express();
var fs = require('fs');
app.use(express.json());
const bodyParser = require('body-parser').urlencoded({extended: false});

//app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('./public'));

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(5).required(),
        code:Joi.string().regex(/^[a-zA-Z]{3}\d{3}$/).required(),
        description:Joi.string().max(200)
    }
    return Joi.validate(course, schema);
}
function validateCourse_update(course) {
    const schema = {
        name: Joi.string().min(5),
        code:Joi.string().regex(/^[a-zA-Z]{3}\d{3}$/),
        description:Joi.string().max(200)
    }
    return Joi.validate(course, schema);
}

function validateStudent(student) {
    const schema = {
        name: Joi.string().regex(/^[a-zA-Z \-\,']*$/).required(),
        code:Joi.string().min(7).max(7).required()
    }
    return Joi.validate(student, schema);
}

function validateStudent_update(student) {
    const schema = {
        name: Joi.string().regex(/^[a-zA-Z \-\,']*$/),
        code:Joi.string().min(7).max(7)
    }
    return Joi.validate(student, schema);
}

const courses =[];
const students =[];

app.get('/',(req,res)=>{
    res.send('hello lms');
});















app.get('/api/courses',(req,res)=>{
    res.send(courses);
});
app.get('/api/courses/:id',(req,res)=>{
    const course =courses.find(c=>c.id===parseInt(req.params.id));
    if(!course)res.status(404).send('no course with that id');
    else res.send(course);
});

app.post('/api/courses',(req,res)=>{
    const { error } = validateCourse(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    const course ={
        id:courses.length+1,
        name:req.body.name,
        code:req.body.code,
        description:req.body.description
    };
    courses.push(course);
    res.send(course);

});

app.get('/web/courses/create',(req,res)=>{

    var filename = "./public/courses_form.html";
    fs.readFile(filename, function(err, data) {
         if (err) {
           res.writeHead(404, {'Content-Type': 'text/html'});
           return res.end("404 Not Found");
         } 
         res.writeHead(200, {'Content-Type': 'text/html'});
         res.write(data);
         return res.end();
       });

});

app.post('/web/courses/create',bodyParser,(req,res)=>{

    const course_form ={
        name:req.body.name,
        code:req.body.code,
        description:req.body.description
    };
    const { error } = validateCourse(course_form); 
    if (error) return res.status(400).send(error.details[0].message);
    const course ={
        id:courses.length+1,
        name:req.body.name,
        code:req.body.code,
        description:req.body.description
    };
    courses.push(course);
    res.send(course);

});
app.put('/api/courses/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('THe course with the given id was not found.');
    const { error } = validateCourse_update(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    if( req.body.name) course.name = req.body.name;
    if(req.body.code) course.code=req.body.code;
    if(req.body.description) course.description=req.body.description;
    res.send(course);
});


app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('THe course with the given id was not found.');
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

































app.get('/api/students',(req,res)=>{
    res.send(students);
});
app.get('/api/students/:id',(req,res)=>{
    const student =students.find(s=>s.id===parseInt(req.params.id));
    if(!student)res.status(404).send('no student with that id');
    else res.send(student);
});

app.post('/api/students',(req,res)=>{
    const { error } = validateStudent(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    const student ={
        id:students.length+1,
        name:req.body.name,
        code:req.body.code,
    };
    students.push(student);
    res.send(student);

});

app.get('/web/students/create',(req,res)=>{

    var filename = "./public/students_form.html";
    fs.readFile(filename, function(err, data) {
         if (err) {
           res.writeHead(404, {'Content-Type': 'text/html'});
           return res.end("404 Not Found");
         } 
         res.writeHead(200, {'Content-Type': 'text/html'});
         res.write(data);
         return res.end();
       });

});
app.post('/web/students/create',bodyParser,(req,res)=>{

    const form_student ={
        name:req.body.name,
        code:req.body.code,
    };
    const { error } = validateStudent(form_student); 
    if (error) return res.status(400).send(error.details[0].message);
    const student ={
        id:students.length+1,
        name:req.body.name,
        code:req.body.code,
    };
    students.push(student);
    res.send(student);

});
app.put('/api/students/:id', (req, res) => {

    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('THe student with the given id was not found.');
    const { error } = validateStudent_update(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    if( req.body.name) student.name = req.body.name;
    if(req.body.code) student.code=req.body.code;
    res.send(student);
});


app.delete('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('THe student with the given id was not found.');
    const index = students.indexOf(student);
    students.splice(index, 1);
    res.send(student);
});























const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`listening on port ${port}...`) );