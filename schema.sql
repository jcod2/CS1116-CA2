DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    user_id TEXT PRIMARY KEY,
    password TEXT NOT NULL
);
-- admind user
INSERT INTO users (user_id, password)
VALUES
  ('Admin', 'pbkdf2:sha256:260000$w07qrnYQh52uoWmR$ec16f2fbabeb429798953c1a84584e56075ffd752d7309a8a28bb7a882ad714e');

DROP TABLE IF EXISTS leaderboard;
 
CREATE TABLE leaderboard
(
    user_id TEXT PRIMARY KEY,
    score INTEGER NOT NULL
);

INSERT INTO leaderboard (user_id, score)
VALUES
  ('Jamie', '999999999');