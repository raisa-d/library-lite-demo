// server.js

/* ===========
IMPORTS
=========== */
import express from 'express'; // import express with ES Modules
import { MongoClient } from 'mongodb'; // import MongoClient with ES Modules

/* ===========
VARIABLES
=========== */
const app = express(); // create instance of Express app
const dirname = import.meta.dirname; // get dirname
const PORT = process.env.PORT;
const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://j97129688:${password}@cluster0.u0qtw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

/* ===========
CONNECTING TO DATABASE
=========== */
async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(uri);
    console.log('Connected to DB');
    const db = client.db('Library');
    const books = db.collection('bookData');
    return books;
  } catch(err) {
    console.error(err);
  };
};

/* ===========
SERVER AND API
=========== */
function createServer(books) {
  app.set('view engine', 'ejs');

  /* ===========
  MIDDLEWARE
  =========== */
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static('public'));

  /* ===========
  ROUTE HANDLERS 
  =========== */
  // handle GET request
  app.get('/', async (request, response) => {
    try {
      const cursor = await books.find();
      const bookList = await cursor.toArray();
      response.render('index.ejs', { bookList: bookList }) // render EJS, pass in bookList
    } catch(err) {
      console.error(`Error retrieving list of books ${err}`);
    };
  });

  // handle POST request - add new book
  app.post('/add', async (request, response) => {
    try {
      const result = await books.insertOne({
        title: request.body.title,
        author: request.body.author,
        read: false
      });
      console.log(result);
      response.redirect('/');
    } catch(err) {
      console.error(`Could not add book: ${err}`);
      response.status(500);
    };
  });

  // handle DELETE request - delete book
  app.delete('/delete', async (request, response) => {
    try {
      // delete book by title
      const result = await books.deleteOne({title: request.body.title});
      response.json('Book deleted');
    } catch(err) {
      console.error(`Failed to delete book: ${err}`);
    };
  });

  // have server listen on PORT
  app.listen(PORT, () => console.log('Server is running away!!!'));
};

/* ===========
START APPLICATION
=========== */
async function main() {
  try {
    const books = await connectToDatabase();
    createServer(books);
  } catch(err) {
    console.error(`Failed to start application: ${err}`);
  };
};

// run app
main();