
var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

const users_sql="INSERT INTO users(username,password,role,state) values ?";
const users_data=[
    ['admin','$2a$10$1jjBG4G4E3qO7i1kMGHg8.M/ieoj2izcWz8zcp2gZZx8WWNI5aQOy','root','UP'],
    ['anmol','$2a$10$o.7vnvY7QscRYG/gIHYdsuT.HNaI133qUHnBBML4viQn0DV1Y2ll.','wholeseller','rajasthan'],
    ['lovely','$2a$10$oAI2xBZQDaqQSjqrA3J0Iu3b/YxKd4xKSrdNzvtBpMj8AkWWofUse','retailer','punjab'],
    ['abhishek','$2a$10$ym0Ja8rvIuFRJvcrBjsi1OnNIceamD2lF/oH2VZOno.CAcN6zmfEK','wholeseller','delhi'],
    ['kiran','$2a$10$QBhk.pD3yFmyDYIvT2JBa.kcHcc2cp4y24HgBUx06WgG.8G4TS1l6','farmer','Tamil Nadu'],
    ['aditya','$2a$10$knLNmlmHeP.nXorrWi1jUuDJsRtdqDJFU6oDpf7xBJh9LYc91695W','farmer','UP']
];

const wholeseller_sql="INSERT INTO Wholeseller(id,title,stock,price) values ?";
const wholeseller_data=[
    [2,'carrot',40,50],
    [2,'watermelon',32,40],
    [4,'apples',15,100],
    [4,'cauliflower',25,20]
];

const retailer_sql="INSERT INTO Retailer(id,title,stock,price) values ?";
const retailer_data=[
    [3,'carrot',30,65],
    [3,'watermelon',20,50],
    [3,'apples',10,120],
    [3,'cauliflower',20,40]
];

const farmer_sql="INSERT INTO Farmer(id,title,stock,price) values ?";
const farmer_data=[
    [5,'carrot',60,40],
    [5,'watermelon',50,30],
    [6,'apples',30,70],
    [6,'cauliflower',45,10]
];

connection.query('CREATE DATABASE IF NOT EXISTS '+dbconfig.database);
connection.query('USE ' + dbconfig.database);

connection.query(users_sql,[users_data],(err,result) => {
    if(err) throw err;
    console.log("Dummy users inserted");
});

connection.query(wholeseller_sql,[wholeseller_data],(err,result) => {
    if(err) throw err;
    console.log("Dummy wholesellers inserted");
});

connection.query(retailer_sql,[retailer_data],(err,result) => {
    if(err) throw err;
    console.log("Dummy retailers inserted");
});

connection.query(farmer_sql,[farmer_data],(err,result) => {
    if(err) throw err;
    console.log("Dummy farmers inserted");
});

connection.end();
