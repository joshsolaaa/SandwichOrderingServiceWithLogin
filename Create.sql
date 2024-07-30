DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS channels;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS products; 

CREATE TABLE IF NOT EXISTS accounts (
  `id` mediumint PRIMARY KEY AUTO_INCREMENT,
  `user` varchar(25),
  `pass` varchar(70)
);

CREATE TABLE IF NOT EXISTS `contacts` (
  `id` mediumint PRIMARY KEY AUTO_INCREMENT,
  `userid` mediumint,
  `name` varchar(30),
  `photo` varchar(30),
  `address` varchar(200),
  `added` datetime
);

CREATE TABLE IF NOT EXISTS `channels` (
  `id` mediumint PRIMARY KEY AUTO_INCREMENT,
  `channelname` enum,
  `contactid` mediumint,
  `description` varchar(30)
);

CREATE TABLE IF NOT EXISTS `comments` (
  `id` mediumint PRIMARY KEY AUTO_INCREMENT,
  `userid` mediumint,
  `channelsid` mediumint,
  `comment` varchar(255),
  `added` datetime
);
CREATE TABLE IF NOT EXISTS products (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(35) NOT NULL,
  name VARCHAR(100) NOT NULL, 
  description VARCHAR(100) NOT NULL, 
  price mediumint, 
  image VARCHAR(500) NOT NULL
);


ALTER TABLE `contacts` ADD FOREIGN KEY (`userid`) REFERENCES `accounts` (`id`);

ALTER TABLE `channels` ADD FOREIGN KEY (`contactid`) REFERENCES `contacts` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`userid`) REFERENCES `accounts` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`channelsid`) REFERENCES `channels` (`id`);
