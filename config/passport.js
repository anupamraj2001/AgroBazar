// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    


    connection.query('\
    CREATE TABLE IF NOT EXISTS`' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
        `username` VARCHAR(20) NOT NULL, \
        `password` CHAR(60) NOT NULL, \
        `role` CHAR(60) NOT NULL,\
        `state` CHAR(60) NOT NULL,\
            PRIMARY KEY (`id`), \
        UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
        UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
    )',function(err, result){
        if(err) throw err;
        console.log("Users Table created Succesfully");
    });

    connection.query("CREATE TABLE IF NOT EXISTS Cart ( \
        `id` INT UNSIGNED NOT NULL, \
        `title` VARCHAR(255) NOT NULL, \
        `image` VARCHAR(250) ,\
        `price` INT NOT NULL, \
        `quantity` INT NOT NULL, \
        `sellerID` INT UNSIGNED NOT NULL, \
        FOREIGN KEY (id) REFERENCES users(id), \
        FOREIGN KEY (sellerID) REFERENCES users(id)\
    ) ", function(err,result){
        if(err) throw err;
        console.log("Cart database created");
    });

    
    connection.query("CREATE TABLE IF NOT EXISTS Wholeseller ( \
        `id` INT UNSIGNED NOT NULL,\
        `title` VARCHAR(255) NOT NULL,\
        `image` varchar(250) ,\
        `price` INT,\
        `stock` INT,\
        FOREIGN KEY (id) REFERENCES users(id)\
    ) ", function(err,result){
        if(err) throw err;
        console.log("Wholeseller database created");
    });
    connection.query("CREATE TABLE IF NOT EXISTS Retailer ( \
        `id` INT UNSIGNED NOT NULL,\
        `title` VARCHAR(255) NOT NULL,\
        `image` varchar(250) ,\
        `price` INT,\
        `stock` INT,\
        FOREIGN KEY (id) REFERENCES users(id)\
    ) ", function(err,result){
        if(err) throw err;
        console.log("Retailer database created");
    });
    connection.query("CREATE TABLE IF NOT EXISTS Farmer( \
        `id` INT UNSIGNED NOT NULL,\
        `title` VARCHAR(255) NOT NULL,\
        `image` varchar(250) ,\
        `price` INT,\
        `stock` INT,\
        FOREIGN KEY (id) REFERENCES users(id)\
    ) ", function(err,result){
        if(err) throw err;
        console.log("Farmer database created");
    });
    // `img` blob ,\
    // `file_name` varchar(45) collate latin1_general_ci ,\
    

    // Items Table
    connection.query("CREATE TABLE IF NOT EXISTS Items ( \
        `id` INT UNSIGNED NOT NULL,\
        `name` VARCHAR(255) NOT NULL,\
        `category` VARCHAR(255) NOT NULL, \
        UNIQUE INDEX `id_UNIQUE` (`id` ASC)\
    ) ", function(err,result){
        if(err) throw err;
        console.log("Items database created");
    });
    
    // Inserting values in table
    // var sql = "INSERT INTO Items (id,name,category) VALUES ?";
    // var items = [
    //     [1,'Apple','Fruit'] , 
    //     [2,'Apricots','Fruit'] ,
    //     [3,'Avocado','Fruit'] ,
    //     [4,'Banana','Fruit'] ,
    //     [5,'Blackberries','Fruit'] ,
    //     [6,'Blackcurrant','Fruit'] ,
    //     [7,'Blueberries','Fruit'] ,
    //     [8,'Cherries','Fruit'] ,
    //     [9,'Clementine','Fruit'] ,
    //     [10,'Coconut','Fruit'] ,
    //     [11,'Cranberries','Fruit'] ,
    //     [12,'Grapefruit','Fruit'] ,
    //     [13,'Grapes','Fruit'] ,
    //     [14,'Guava','Fruit'] ,
    //     [15,'Jackfruit','Fruit'] ,
    //     [16,'Kiwifruit','Fruit'] ,
    //     [17,'Kumquat','Fruit'] ,
    //     [18,'Lemon','Fruit'] ,
    //     [19,'Lychee','Fruit'],
    //     [20,'Mango','Fruit'] ,
    //     [21,'Mulberries','Fruit'] ,
    //     [22,'Olives','Fruit'] ,
    //     [23,'Papaya','Fruit'] ,
    //     [24,'Pear','Fruit'] ,
    //     [25,'Pineapple','Fruit'] ,
    //     [26,'Plums','Fruit'] ,
    //     [27,'Pomegranate','Fruit'] ,
    //     [28,'Prunes','Fruit'] ,
    //     [29,'Raspberries','Fruit'] ,
    //     [30,'Strawberries','Fruit'] ,
    //     [31,'Tamarind','Fruit'] ,
    //     [32,'Beetroot','Vegetable'] ,
    //     [33,'Bitter Gourd','Vegetable'] ,
    //     [34,'Black Pepper','Vegetable'] ,
    //     [35,'Bottle Gourd','Vegetable'] ,
    //     [36,'Cabbage','Vegetable'] ,
    //     [37,'Capsicum','Vegetable'] ,
    //     [38,'Carrot','Vegetable'] ,
    //     [39,'Cauliflower','Vegetable'] ,
    //     [40,'Corn','Vegetable'] ,
    //     [41,'Chilli','Vegetable'] ,
    //     [42,'Cucumber','Vegetable'] ,
    //     [43,'Curry Leaf','Vegetable'] ,
    //     [44,'Garlic','Vegetable'] ,
    //     [45,'Ginger','Vegetable'] ,
    //     [46,'Green Beans','Vegetable'] ,
    //     [47,'Jackfruit','Vegetable'] ,
    //     [48,'Lady Finger','Vegetable'] ,
    //     [49,'Mushroom','Vegetable'] ,
    //     [50,'Onion','Vegetable'] ,
    //     [51,'Peas','Vegetable'] ,
    //     [52,'Potato','Vegetable'] ,
    //     [53,'Radish','Vegetable'] ,
    //     [54,'Spinach','Vegetable'] ,
    //     [55,'Spring Onion','Vegetable'] ,
    //     [56,'Sweet Potato','Vegetable'] ,
    //     [57,'Tomato','Vegetable'] ,
    //     [58,'Turmeric','Vegetable'] ,
    //     [59,'Turnip','Vegetable']
    // ]; 
    
//     var sql = "INSERT INTO Items (id,name,category) VALUES ?";
//     var items = [
//         [60,'Ajwain','Spice'] ,
//         [61,'Almond','Spice'] ,
//         [62,'Black Pepper','Spice'] ,
//         [63,'Cardamom','Spice'] ,
//         [64,'Cinnamon','Spice'] ,    
//         [65,'Clove','Spice'] ,         
//         [66,'Coriander','Spice'] ,
//         [67,'Cumin','Spice'] ,
//         [68,'Curry Leaves','Spice'] ,
//         [69,'Garlic','Spice'] ,
//         [70,'Ginger','Spice'] ,
//         [71,'Heeng','Spice'] ,
//         [72,'Mint','Spice'] ,
//         [73,'Mustard','Spice'] ,
//         [74,'Red Chilli','Spice'] ,
//         [75,'Saunf','Spice'] ,
//         [76,'Tej Patta','Spice'] ,
//         [77,'Tulsi','Spice'] ,
//         [78,'Turmeric','Spice']
//     ];
// //        
// //         
//   connection.query(sql,[items], function (err, result) {
//     if (err) throw err;
//     console.log(result.affectedRows + " records inserted");
//   });
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null),
                        role : req.body.role,
                        state: req.body.state,
                          // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( username, password,role,state ) values (?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.role, newUserMysql.state],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};
