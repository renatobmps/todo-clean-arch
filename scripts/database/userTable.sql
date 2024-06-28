CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password) VALUES ('Elliot Alderson', 'elliot@email.com', '12345678');
INSERT INTO users (name, email, password) VALUES ('Darlene Alderson', 'mary@email.com', '12345678');
INSERT INTO users (name, email, password) VALUES ('Tyrell Wellick', 'tyrell@email.com', '12345678');
