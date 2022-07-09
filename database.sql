use my_schema;

CREATE TABLE IF NOT EXISTS users( 
        id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
        username VARCHAR(20) NOT NULL, 
        password CHAR(60) NOT NULL, 
        role CHAR(60) NOT NULL,
        state CHAR(60) NOT NULL,
            PRIMARY KEY (id), 
        UNIQUE INDEX id_UNIQUE (id ASC), 
        UNIQUE INDEX username_UNIQUE (username ASC));
	
CREATE TABLE IF NOT EXISTS Cart ( 
        id INT UNSIGNED NOT NULL, 
        title VARCHAR(255) NOT NULL, 
        price INT NOT NULL, 
        quantity INT NOT NULL, 
        sellerID INT UNSIGNED NOT NULL, 
        FOREIGN KEY (id) REFERENCES users(id), 
        FOREIGN KEY (sellerID) REFERENCES users(id));
        
CREATE TABLE IF NOT EXISTS Wholeseller ( 
        id INT UNSIGNED NOT NULL,
        title VARCHAR(255) NOT NULL,
        image varchar(250) NOT NULL,
        price INT,
        stock INT,
        FOREIGN KEY (id) REFERENCES users(id));
        
CREATE TABLE IF NOT EXISTS Retailer ( 
        id INT UNSIGNED NOT NULL,
        title VARCHAR(255) NOT NULL,
        image varchar(250) NOT NULL,
        price INT,
        stock INT,
        FOREIGN KEY (id) REFERENCES users(id));

CREATE TABLE IF NOT EXISTS Farmer( 
        id INT UNSIGNED NOT NULL,
        title VARCHAR(255) NOT NULL,
        image varchar(250) NOT NULL,
        price INT,
        stock INT,
        FOREIGN KEY (id) REFERENCES users(id));
