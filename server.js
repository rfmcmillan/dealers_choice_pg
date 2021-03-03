const express = require('express');
const app = express();
const { syncAndSeed, setUp, client } = require('./db');
const path = require('path');

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
      </div>
    </body>
  </html>
  `;
    res.send(html);
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
