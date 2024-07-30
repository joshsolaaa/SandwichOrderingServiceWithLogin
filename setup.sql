
-- make sure the websiteuser account is set up and has the correct privileges
CREATE USER IF NOT EXISTS websiteuser IDENTIFIED BY 'websitepassword';
GRANT INSERT, SELECT, UPDATE, DELETE ON website.* TO websiteuser;

DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS products; 

CREATE TABLE IF NOT EXISTS accounts (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(25) NOT NULL,
  username VARCHAR(50), 
  useraddress VARCHAR(300), 
  pass VARCHAR(70) NOT NULL
);

 CREATE TABLE IF NOT EXISTS orders (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sandwichId MEDIUMINT UNSIGNED,
  drinkId MEDIUMINT UNSIGNED,
  snackId MEDIUMINT UNSIGNED,
  accountId MEDIUMINT UNSIGNED,
  isCompleted BOOLEAN DEFAULT false, 
  FOREIGN KEY (sandwichId) REFERENCES products(id),
  FOREIGN KEY (drinkId) REFERENCES products(id),
  FOREIGN KEY (snackId) REFERENCES products(id),
  FOREIGN KEY (accountId) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS products (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(35) NOT NULL,
  name VARCHAR(100) NOT NULL, 
  description VARCHAR(100) NOT NULL, 
  price mediumint, 
  isDeleted BOOLEAN DEFAULT false, 
  image VARCHAR(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS contacts (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  userid mediumint,
  name varchar(30),
  photo varchar(30),
  address varchar(200),
  added datetime
);

CREATE TABLE IF NOT EXISTS channels (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  channelname varchar(30),
  contactid mediumint,
  description varchar(30)
);

CREATE TABLE IF NOT EXISTS comments (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  userid mediumint,
  channelsid mediumint,
  comment varchar(255),
  added datetime
);

--ALTER TABLE contacts ADD FOREIGN KEY (userid) REFERENCES accounts (id);
--ALTER TABLE channels ADD FOREIGN KEY (contactid) REFERENCES contacts (id);
--ALTER TABLE comments ADD FOREIGN KEY (userid) REFERENCES accounts (id);
--ALTER TABLE comments ADD FOREIGN KEY (channelsid) REFERENCES channels (id);

INSERT INTO accounts(user, pass)
	VALUES("doej", "$2b$10$gL33obKAFUT5DK3pEbh72OIHztsWBniBBh.PdeKOrF1yr5KFAsdZO");

    insert into accounts(user, pass)
    values("admin", "p455word");


  

  