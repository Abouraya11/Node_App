const express= require('express');
const mongoose=require('mongoose');
var axios = require("axios").default;


const path = require('path');
const Blog = require('./models/blog');
const temp=require('./models/temperatur');


const app= express();

const dbURI= "mongodb+srv://Abyu:123456Ab@cluster0.i6naw.mongodb.net/Br?retryWrites=true&w=majority"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(process.env.PORT||3000)).catch((err) => console.log(err));



app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }));

var options = {
  method: 'GET',
  url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
  params: {q: 'Cairo', days: '1'},
  headers: {
    'x-rapidapi-host': "weatherapi-com.p.rapidapi.com",
    'x-rapidapi-key': "d69275d554msh8837eb351c89453p143216jsn45b7734dc505"
  }
};

app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ', req.path);
  console.log('method: ', req.method);
  next();
});  

// routes
app.get('/',(req,res)=>{
    
  res.redirect('/blogs');
});

app.get('/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' })

});

app.get('/about',(req,res)=>{ 

    res.render('about', { title: 'About'})
});


app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
    });
});
  

app.post('/blogs', (req, res) => {
  
  const blog = new Blog(req.body);

  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/current_temp',(req,res)=>{
  axios.request(options).then(function (response) {

  let y=response.data.current.temp_c.toString();
  let x=response.data.location.name;
  let z=response.data.current.humidity.toString();

  const temp1 = new temp({
    name:y,
    temperature:x,
    humidity:z
  });
  temp1.save()
    

  res.render('temperature', { name: x, temp: y,humidity:z,title: 'Current Temperature'})
    }).catch(function (error) {
      console.error(error);
    
});
});

app.use((req,res)=>{ //Middleware run every time

    res.render('404', { title: '404' });
});