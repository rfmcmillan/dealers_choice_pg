const pg = require('pg');

const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/books_db'
);

const syncAndSeed = async () => {
  const SQL = `
  DROP TABLE IF EXISTS books;
  CREATE TABLE books(
    ID INT PRIMARY KEY NOT NULL,
    TITLE TEXT NOT NULL,
    AUTHOR TEXT NOT NULL,
    YEAR INT,
    GENRE TEXT);
    INSERT INTO books (ID, TITLE, AUTHOR, YEAR, GENRE) VALUES (1, 'City of Thieves', 'David Benioff', 2009, 'Historical Fiction');
    INSERT INTO books (ID, TITLE, AUTHOR, YEAR, GENRE) VALUES (2, 'The Name of the Wind', 'Patrick Rothfuss', 2007, 'Fantasy');
    INSERT INTO books (ID, TITLE, AUTHOR, YEAR, GENRE) VALUES (3, 'The Amazing Adventures of Kavalier & Clay', 'Michael Chabon', 2001, 'Fiction');
    INSERT INTO books (ID, TITLE, AUTHOR, YEAR, GENRE) VALUES (4, 'The Art of Fielding', 'Chad Harbach', 2011, 'Fiction');
    INSERT INTO books (ID, TITLE, AUTHOR, YEAR, GENRE) VALUES (5, 'Narcissus and Goldmund', 'Herman Hesse', 1930, 'Fiction');
    `;

  await client.query(SQL);
};

const setUp = async () => {
  try {
    await client.connect();
    await syncAndSeed();
    console.log('connected to database');
  } catch (error) {
    console.log('error');
  }
};

module.exports = { client, setUp };
