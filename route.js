const express = require('express');
const path = require('path');
const { title } = require('process');
const User = require(path.join(__dirname, 'models', 'user'));
const router = express.Router();

// include database connection file
const Conn = require(path.join(__dirname, 'config', 'db'));


router.get('/', (req, res) => {
  res.render('login',{
    title : 'Home Page',
    success : true,
    message : 'welcome to user page',
  });
})



router.get('user', (req, res) => {
  const sql = 'SELECT * FROM users';
  Conn.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      // req.session.success = true;
      // req.session.message = 'Operation completed successfully!';
      res.render('users/home',{
        // success : true,
        // message : 'welcome to home page',
        users : results
      });
  });
});

// API route to handle form submission
router.post('/submit-form', async (req, res) => {
  const { first_name, last_name, email, mobile } = req.body;
  const sql = 'INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)';
  Conn.query(sql, [first_name+' '+last_name, email, mobile], (err, result) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.send({ message: 'User created', success: true });
  });
});

router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';
  Conn.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    output = results[0];
    str = output.name.split(" ")
    output = {
      id : output.id,
      first_name : str[0],
      last_name : str[1],
      email : output.email,
      mobile : output.mobile,
    } 
    res.render('users/edit',{
      user : output
    });
  });
});


router.post('/edit/:id', (req, res) => {
  const { id } = req.params; // Get the ID from the route
  const { first_name, last_name, email, mobile } = req.body; // Get the data from the request body

  if (!first_name || !last_name || !email || !mobile) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const name = `${first_name} ${last_name}`;
  const sql = 'UPDATE users SET name = ?, email = ?, mobile = ? WHERE id = ?';

  Conn.query(sql, [name, email, mobile, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.redirect('/');
  });
});

router.get('/delete/:id', (req, res) => {
  const { id } = req.params; // Get the ID from the route
  const sql = 'DELETE from users where id = ?';

  Conn.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.session.success = true;
    req.session.message = 'User Deleted Successfully!';
    res.redirect('/');
  })
});

module.exports = router;
