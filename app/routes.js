// app/routes.js

var fs = require('fs');
var results;
var mysql = require('mysql2');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
module.exports = function(app, passport, url, path){

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	
	
	app.get('/', function(req, res) {
		console.log(__dirname);
		req.session.admin=false;
		var isLoggedIn;
		if(req.isAuthenticated()){
			isLoggedIn = 1;
		}
		else{
			isLoggedIn = 0;
		}
		connection.query("SELECT * FROM Wholeseller INNER JOIN users ON users.id=Wholeseller.id ",function(err, result){
			var results={};
			if(err) throw err;
			results=result;
			connection.query("SELECT * FROM Retailer INNER JOIN users ON users.id=Retailer.id",function(err,result){
				if(err) throw err;
				results = results.concat(result);
				connection.query("SELECT * FROM Farmer INNER JOIN users on users.id=Farmer.id",function(err, result){
					if(err) throw err;
					results = results.concat(result);
					res.render('index.ejs',{authenticated:isLoggedIn,results: results,req:req }); // load the index.ejs file
				});
				
			});
		});
		
		// console.log(results);
		// results = foo();
		// console.log(dict.results);
		// console.log(listings);

	
		// console.log(isLoggedIn);
		
	});
	
	app.get('/updateListing/:title/:price/:stock',function(req,res){
		var title = req.params.title;
		var price = req.params.price;
		var stock = req.params.stock;
		res.render('updateListing.ejs',{title:title, price:price, stock:stock});

	});

	app.get('/deleteListing/:title/:price/:stock', function(req,res){
		var title = req.params.title;
		var price = req.params.price;
		var stock = req.params.stock;
		connection.query("DELETE FROM "+ req.user.role + " WHERE id='" + req.user.id + "' and title='"+ title+"' and price='"+ price + "' and stock='" + stock +"'",function(err,result){
			if(err)throw err;
			res.redirect("/");
		});
	});

	app.post('/updateListing',isLoggedIn, function(req,res){
		var title = req.body.title;
		var price = req.body.price;
		var stock = req.body.stock;
		console.log(price);
		var query = "UPDATE "+ req.user.role + " set stock='" + stock +"' , price='" + price + "' where id='" + req.user.id +"' and title='" + title + "'";
		console.log(query);
		connection.query(query,function(err,result){
			if(err) throw err;
			console.log(result.length);
			res.redirect("/");
		});
	});

	app.get("/deleteItemCart/:id/:sellerID/:title/:quantity/:price/:image",function(req,res){
		id = req.params.id;
		sellerID = req.params.sellerID;
		title = req.params.title;
		quantity = req.params.quantity;
		price = req.params.price;
		image = req.params.image;
		connection.query("DELETE FROM Cart WHERE id='" + id +"' and sellerID='"+ sellerID +"' and title='"+ title +"'",function(err,result){
			if(err) throw err;
			connection.query("SELECT * from users WHERE id='"+ sellerID +"'",function(err,result){
				if(err) throw err;
				var role = result[0].role;
				connection.query("SELECT * FROM "+ result[0].role+ " WHERE id='" + sellerID + "' and title='"+ title +"'",function(err,result){
					if(err) throw err;
					if(result.length>0){
						connection.query("UPDATE "+ role + " SET stock=stock+" + quantity +" WHERE title='"+ title+"' and id='"+ sellerID+"'",function(err,result){
							if(err) throw err;
							res.redirect('/cart.html');
						});
					}	
					else{
						connection.query("INSERT INTO "+role+ " VALUES (?,?,?,?,?)",[sellerID, title,image,price,quantity ],function(err,result){
							if(err) throw err;
							res.redirect("/cart.html");
						});
					}
				});
			});
		});
	});

	app.get('/viewProducts', function(req,res){
		connection.query("SELECT * FROM Wholeseller INNER JOIN users ON users.id=Wholeseller.id ",function(err, result){
			var results={};
			if(err) throw err;
			results=result;
			connection.query("SELECT * FROM Retailer INNER JOIN users ON users.id=Retailer.id",function(err,result){
				if(err) throw err;
				results = results.concat(result);
				connection.query("SELECT * FROM Farmer INNER JOIN users ON users.id=Farmer.id", function(err, result){
					if(err) throw err;
					results = results.concat(result);
					console.log(results);
					res.render('viewAll.ejs',{results: results,req:req});
				});
				// console.log(results);
				
				// console.log(objs);
				
			});
			
			// setValue(result);
			// setTimeout(function(){
			// 	results =result;
			// 	alert(results);
			// }, Math.random()*2000);
			// results = result;
			// console.log(result);
		});
		
	});

	app.get('/viewProducts/:state', function(req,res){
		var state = req.params.state;
		if(state == 'All'){
			res.redirect('/viewProducts/');
		}
		console.log(state);
		connection.query("SELECT * FROM Wholeseller INNER JOIN users ON users.id=Wholeseller.id where state='"+ state+"'",function(err, result){
			var results={};
			if(err) throw err;
			results=result;
			connection.query("SELECT * FROM Retailer INNER JOIN users ON users.id=Retailer.id where state='"+ state+"'",function(err,result){
				if(err) throw err;
				results = results.concat(result);
				console.log(results);
				connection.query("SELECT * FROM Farmer INNER JOIN users ON users.id=Farmer.id where state='"+ state+"'", function(err, result){
					results= results.concat(result);
					res.render('viewAll.ejs',{results: results,req:req});
				});
				
				// console.log(objs);
			
			});
			
			// setValue(result);
			// setTimeout(function(){
			// 	results =result;
			// 	alert(results);
			// }, Math.random()*2000);
			// results = result;
			// console.log(result);
		});

	})



	app.post("/makeTransaction/:title/:username/:role/:price/:image",isLoggedIn, function(req,res){
		var title = req.params.title;
		var username = req.params.username;
		var role = req.params.role;
		var price = req.params.price;
		var image = req.params.image;
		var quantityToAdd = req.body.quantity;
		console.log(quantityToAdd);
		connection.query("SELECT id from users where username='" + username+ "'", function(err,result){
			if(err) throw err;
			var id = result[0].id;
			connection.query("SELECT * FROM Cart where title='"+ title + "' and sellerID='"+ result[0].id + "' and price='" + price + "' and id='"+ req.user.id + "'",function(err,result){
				if(err) throw err;
				if(result.length>0){
					connection.query("UPDATE Cart SET quantity=quantity+"+ quantityToAdd+" where title='"+ title + "' and sellerID='"+ id + "' and price='" + price + "' and id='"+ req.user.id + "'",
			 		function(err,result){
					if(err) throw err;
					connection.query("UPDATE "+ role+ " SET stock=stock-"+ quantityToAdd+" WHERE id='"+ id + "' and title='"+ title+ "'", function(err, result){
						if(err) throw err;
						connection.query("DELETE FROM "+ role +" where stock<=0",function(err,result){
							console.log(result);
							res.redirect("/");
						});
					});
			}); 
				}
				else{
					connection.query("INSERT INTO Cart (id, title,image, price, quantity, sellerID) values (?,?,?,?,?,?)",[req.user.id, title,image, price, quantityToAdd, id],
					function(err,result){
						if(err) throw err;
						connection.query("UPDATE "+ role+ " SET stock=stock-"+ quantityToAdd+" WHERE id='"+ id + "' and title='"+ title+ "'", function(err, result){
							if(err) throw err;
							connection.query("DELETE FROM "+ role +" where stock<=0",function(err,result){
								console.log(result);
								res.redirect("/");
							});
						});
					});
				}
			});
			  
		});
		// connection.query("UPDATE Wholeseller SET stock=stock-1 WHERE ")
	});

	app.get('/admin',isLoggedIn,async (req,res) => {

		if(req.session.admin){
					const users_data=await connection.promise().query("Select * from users");
					const wholesellers=await connection.promise().query("Select * from Wholeseller");
					const retailers=await connection.promise().query("Select * from Retailer");
					const farmers=await connection.promise().query("Select * from Farmer");
					
					res.render("admin.ejs",{
						users_data:users_data[0],
						wholesellers:wholesellers[0],
						retailers:retailers[0],
						farmers:farmers[0]
					});
		}

		else{
			res.redirect('/');
		}
		
	})

	app.post('/insertDatabase',(req,res) => {
		const table_name=req.body.table_name.trim(' ');
		const id=req.body.id.trim(' ');
		const title_name=req.body.title_name.trim(' ');
		const stock=req.body.stock.trim(' ');
		const price=req.body.price.trim(' ');

		if(table_name && id && title_name && stock && price){
			const sql="insert into "+table_name+" values(?,?,?,?)";
			connection.query(sql,[id,title_name,stock,price],(err,result) => {
				if(err) throw err;
				res.redirect('/admin');
	
			})
		}

		else{
			res.redirect('/admin');
	
		}

		
	})

	app.post('/updateDatabase',(req,res) => {
		const table_name=req.body.table_name.trim(' ');
		const column_name=req.body.column_name.trim(' ');
		const title_name=req.body.title_name.trim(' ');
		const id=req.body.id.trim(' ');
		const updated_value=req.body.updated_value.trim(' ');

		if(table_name==="users"){
			if(column_name && id && updated_value){
				 let sql="update users set "+column_name+" = '"+updated_value+"' where id = '"+id+"'";
				 connection.query(sql,(err,result) => {
					 if(err) throw err;
					 res.redirect('/admin');
				 })
			}
			else{
				res.redirect('/admin');
			}

		}

		else{
			if(table_name && column_name && title_name && id && updated_value){
				let sql="update "+table_name+" set "+column_name+" = "+updated_value+" where id = '"+id+"' and title='"+title_name+"'";
				connection.query(sql,(err,result) => {
					if(err) throw err;
					res.redirect('/admin');
				})
			}

			else{
				res.redirect('/admin');

			}
		}

	})

	app.post('/deleteDatabase',(req,res) => {
		const table_name=req.body.table_name.trim(' ');
		const id=req.body.id.trim(' ');
		const title_name=req.body.title_name.trim(' ');

		if(table_name==="users"){
			if(id){
				const sql="Delete from "+table_name+" where id='"+id+"'";
				connection.query(sql,(err,result) => {
					if(err) throw err;
					res.redirect('/admin');
				})
			}

			else{
				res.redirect('/admin');

			}
		}

		else{
			if(table_name && id && title_name){
				const sql="Delete from "+table_name+" where id='"+id+"' and title='"+title_name+"'";
				connection.query(sql,(err,result) => {
					if(err) throw err;
					res.redirect('/admin');
				})
			}

			else{
				res.redirect('/admin');

			}
		}

	})


	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.set('view engine','ejs');
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		failureRedirect : '/login', // redirect back to the login page if there is an error
		failureFlash : true // allow flash messages
	}),
	(req, res) => {
					console.log("hello");

		if (req.body.remember) {
		  req.session.cookie.maxAge = 1000 * 60 * 3;
		} else {
		  req.session.cookie.expires = false;
					}
					
			if(req.user["username"]==="admin"){
					req.session.admin=true;
					res.redirect("/admin");
					
					//res.render("admin.ejs");		//console.log(users_data[0][0].id);
			}		
			else				
				res.redirect('/');
});

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});
	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});



	//my routes

	app.get('/about.html', function(req,res){
		res.render('about.ejs');
	});
	app.get('/checkout.html', function(req,res){
		res.render('checkout.ejs');
	});

	app.get('/product-single.html', function(req,res){
		res.render('product-single.ejs');
	});

	app.get('/index.html',function(req,res){
		res.redirect('/');
	});

  app.get('/cart.html',isLoggedIn, function(req,res){
		// console.log('Hello');
		connection.query("SELECT * FROM Cart WHERE id='"+ req.user.id+"'",function(err, result){
			if(err)throw err;
			console.log(result);
			res.render('cart.ejs',{req:req,results:result});
		});
		
	});


	app.get('/wholeSellerListing',function(req,res){
        connection.query("SELECT name from Items where category='Fruit'", function(err,result,fields){
			if(err) throw err;
            var fruits = [];
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                //console.log(row.name);
                fruits.push(row.name);
            });
            connection.query("SELECT name from Items where category='Vegetable'", function(err,result,fields){
                if(err) throw err;
                var vegetables = [];
                Object.keys(result).forEach(function(key) {
                    var row = result[key];
                    //console.log(row.name);
                    vegetables.push(row.name);
                });
                connection.query("SELECT name from Items where category='Spice'", function(err,result,fields){
                    if(err) throw err;
                    var spices = [];
                    Object.keys(result).forEach(function(key) {
                        var row = result[key];
                        //console.log(row.name);
                        spices.push(row.name);
                    });
                    res.render('addListing.ejs',{'req':req , fruit: fruits , vegetable: vegetables, spice: spices});
                });
            });
        });
	});

	app.post('/wholeSellerListing', isLoggedIn, function(req,res){
		console.log(req.files);
		// console.log(req.body.img);
		// var img = fs.readFileSync(req.body.img);
		// connection.query("INSERT INTO "+ req.user.role+ " (id , title, price, stock ) VALUES (?,?,?,?) ", [req.user.id, req.body.title, req.body.price, req.body.stock],function(err, result){
		// 	if(err) throw err;
		// 	console.log("Entry Successsfully created");
		// });
		// res.send("Entry Successful");
		// // res.redirect('/');
		if (!req.files)
		  return res.status(400).send('No files were uploaded.');
 
		  var file = req.files.img;
		  var img_name=file.name;
 
	  	if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 
              file.mv('views/public/images/upload_images/'+file.name, function(err) {
                             
	              if (err)
 
	                return res.status(500).send(err);
                  connection.query("INSERT INTO "+ req.user.role+ " (id , title, price, stock, image) VALUES (?,?,?,?,?) ", [req.user.id, req.body.title, req.body.price, req.body.stock,img_name],function(err, result){
			             if(err) throw err;
                        res.redirect('/');
                      console.log("Entry Successsfully created");
		          });
	           });
          } else {
            message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
            res.render('index.ejs',{message: message});
          }	
		

	});

	app.get('*', function(req,res){
		var pathName = url.parse(req.url).pathname;
		console.log(pathName);
		res.sendFile(path.join(__dirname, '../views' + pathName));
	});

}

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/login');
};