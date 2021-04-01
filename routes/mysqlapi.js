const express = require('express');
const mysql = require('mysql');
const route = express.Router();

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'nodemysql'
  });
  
  db.connect((err) => {
    if(err){
      throw err
    } else {
      console.log('connected...');
    }
  })

// MYSQL QUERIES

// POST User Details
route.post('/user', (req,res) => {
    const user = {
      country: req.body.country,
      city: req.body.city,
      isp: req.body.isp,
      time: req.body.time,
      flag: req.body.flag
    }
    const sql = 'INSERT INTO USERS SET ?'
    let query = db.query(sql, user, (err, result)=>{
      if(err) throw err;
      console.log(result);
      res.send('posted success...');
    })
})

// GET User Details
route.get('/user', (req,res) => {

    const sql = 'SELECT * FROM USERS ORDER BY time DESC'
    let query = db.query(sql, (err, results)=>{
      if(err) throw err;
      console.log(results);
      res.send({
          data: results
      });
    })
})

// GET User Details
route.delete('/user/:id', (req,res) => {
    const sql = `DELETE FROM users WHERE id=${req.params.id}`
    let query = db.query(sql, (err, results)=>{
      if(err) throw err;
      console.log(results);
      res.send('deleted successfully');
    })
})







// Create Database
route.get('/createDB', (req,res) => {
    const sql = 'CREATE DATABASE nodemysql'
    db.query(sql, (err, result)=>{
      res.send('db created...')
    })
  })
  
// Create Table
route.post('/table', (req,res) => {
const sql = `CREATE TABLE ${req.body.table}(id int AUTO_INCREMENT, 
    country VARCHAR(255), 
    city VARCHAR(255), 
    isp VARCHAR(255), 
    flag VARCHAR(255),
    time DATETIME,
    PRIMARY KEY(id))`
db.query(sql, (err, result)=>{
    if(err) throw err;
    console.log(result);
    res.send('table created...');
})
})

// Create Table
route.delete('/table', (req,res) => {
    const sql = 'DROP TABLE users'
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.send('deleted...');
    })
})


module.exports = route;