const express = require('express');
const app = express();
const { syncAndSeed, setUp, client } = require('./db');
const path = require('path');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', async (req, res, next) => {
  try {
    const books = await client.query('SELECT * FROM books');
    const html = `
  <html>
    <head>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <div class="container">
        <h1>Books Database</h1>
        <ul>${books.rows
          .map((book) => {
            return `<li><a href='/${book.id}'>${book.title}</a> by <small>${book.author}</small></li>`;
          })
          .join('')}
        </ul>
        <h3>Add A Book</h3>
        <form method="POST" action="/">
          <label>ID*:</label>
          <input name="ID" type="number"></input>
          <br>
          <label>Title*:</label>
          <input name="TITLE"></input>
          <br>
          <label>Author*:</label>
          <input name="AUTHOR"></input>
          <br>
          <label>Year:</label>
          <input name="YEAR"></input>
          <br>
          <label>Genre:</label>
          <input name="GENRE"></input>
          <br>
          <button>Create Book</button>
        </form>
      </div>
    </body>
  </html>
  `;
    res.send(html);
  } catch (error) {
    next(error);
  }
});

app.post('/', async (req, res, next) => {
  try {
    console.log('req.body:', req.body);
    const newBook = req.body;
    console.log('newBook:', newBook);
    const SQL = `
    INSERT INTO books (ID, TITLE, AUTHOR, YEAR, GENRE) VALUES (${newBook.ID}, '${newBook.TITLE}', '${newBook.AUTHOR}', ${newBook.YEAR}, '${newBook.GENRE}');
    `;
    console.log('SQL:', SQL);
    await client.query(SQL);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

app.get('/:id', async (req, res, next) => {
  try {
    const data = await client.query(
      `SELECT * FROM books WHERE id = ${req.params.id * 1};`
    );
    const book = data.rows[0];

    const html = `
    <html>
      <head>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <div class="container">
          <h1>Books Database</h1>
          <h3>${book.title}</h3>
          <ul>
            <li>Author: ${book.author}</li>
            <li>Year: ${book.year}</li>
            <li>Genre: ${book.genre}</li>
          </ul>
          <h3 ><a href='/'><<</a></h3>
        </div>
      </body>
    </html>
    `;
    res.send(html);
  } catch (error) {}
});

const init = async () => {
  await setUp();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port: ${port}`));
};

init();
