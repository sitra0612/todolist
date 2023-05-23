const express = require('express');
const db= require("./database.js")

const bodyParser = require('body-parser');
const session = require('express-session');
const sign= require("./validate.js")
const bcrypt =require("bcryptjs")
const ejs = require('ejs');
const app = express();


// Database connection


// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
  res.render('login', { message: '' });
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
 
  if (!sign.validateBoth(email,password) ) {
    return res.render('login', { message: 'Please enter both email and password' });
  }

  db.query('SELECT * FROM information WHERE email = ?', [email], async (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length === 0 || !await bcrypt.compare(password, results[0].password)) {
      res.render('login', { message: 'Invalid email or password' });
    } else {
      req.session.loggedIn = true;
      req.session.email = email;
      res.redirect('/index');
    }
  });
});

app.get('/signup', (req, res) => {
  res.render('signup', { message: '' });
});

app.post('/signup', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const age = req.body.age;
  const fullname= req.body.fullname;

  if (!sign.validateAll(fullname,email,password,age)) {
    return res.render('signup', { message: 'Please enter all fields' });
  }

  if (!sign.validateEmail(email)) {
    return res.render('signup', { message: 'Please enter a valid email address' });
  }

  if (!sign.validatePassword(password)) {
    return res.render('signup', { message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
  }
   const hpassword= await sign.hash(password)
   console.log(hpassword)
  // console.log(sign.validateEmail(email))
  db.query('SELECT * FROM information WHERE email = ?', [email], (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length > 0) {
      res.render('signup', { message: 'email already exists' });
    } else {
      db.query('INSERT INTO information (fullname, email, password, age) VALUES (?, ?,?,?)', [fullname,email, hpassword,age], (err) => {
        if (err) {
          throw err;
        }
        req.session.loggedIn = true;
        req.session.email = email;
        res.redirect('/index');
      });
    }
  });
});

// app.get('/index', (req, res) => {
  
// });

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/index', (req, res) => {

  // if (!req.session.loggedIn) {
  //   res.redirect('/');
  // } else {
  //   res.render('index', { email: req.session.email });
  // }
  const query = 'SELECT * FROM tasks';
   
 
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving tasks: ', err);
      res.render('index', { error: 'Failed to retrieve tasks', tasks: [] });
      return;
    }
    res.render('index', { tasks: results });
  });
});

// Add new task
app.post('/add', (req, res) => {
  const task = req.body.task;

  // const result = dval.check(task);
  // dval.check(task, (err, usertask) => {
  //   if (err) {
  //     res.status(500).send('Internal Server Error');
  //     return;
  //   }

  //   // Send the user information back to the calling page
  //   if (!usertask) {
  //     return res.render('this task is already added');
  //   }
  // });
  // console.log(result)
  // if(result){
  const query = 'INSERT INTO tasks (task) VALUES (?)';

  db.query(query, [task], (err, result) => {
    if (err) {
      console.error('Error creating task: ', err);
      res.redirect('/');
      return;
    }
    res.redirect('/index');
  });
// }else {
  //return res.render('index', { message: 'this task is already registered' });
  // res.redirect('/index');
  

// }
});

// Delete task
app.post('/delete/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM tasks WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting task: ', err);
      res.redirect('/index');
      return;
    }
    res.redirect('/index');
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// Helper functions
