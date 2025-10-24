-- Create a new MySQL user for ChatVerse
-- Run this after connecting to MySQL as root

CREATE USER 'chatverse_user'@'localhost' IDENTIFIED BY 'chatverse123';
GRANT ALL PRIVILEGES ON chatverse.* TO 'chatverse_user'@'localhost';
FLUSH PRIVILEGES;

-- Show the user was created
SELECT User, Host
FROM mysql.user
WHERE User = 'chatverse_user';

