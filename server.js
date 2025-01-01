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
  /* ===========
  MIDDLEWARE
  =========== */
  app.use(express.urlencoded({ extended: true }))

  /* ===========
  ROUTE HANDLERS 
  =========== */
  // handle GET request
  app.get('/', async (request, response) => {
    const cursor = await books.find().toArray()
    console.log(cursor);
    response.sendFile(`${dirname}/index.html`);
  });

  // handle POST request - add new book
  app.post('/add', async (request, response) => {
    try {
      const result = await books.insertOne(request.body);
      console.log(result);
      response.redirect('/');
    } catch(err) {
      console.error(`Could not add book: ${err}`);
      response.status(500);
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