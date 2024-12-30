// server.js
/* ===========
IMPORTS
=========== */
import express from 'express'; // import express with ES Modules
import { MongoClient, ServerApiVersion } from 'mongodb'; // import MongoClient with ES Modules

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
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
async function run() {
    try {
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
      await client.close();
}
}
run().catch(console.dir);

/* ===========
MIDDLEWARE
=========== */
app.use(express.urlencoded({ extended: true }))


/* ===========
ROUTE HANDLERS 
=========== */
// handle GET request
app.get('/', (request, response) => {
    response.sendFile(`${dirname}/index.html`);
});

// handle POST request
app.post('/add', (request, response) => {
    console.log(request);
    response.redirect('/');
});

// have server listen on PORT
app.listen(PORT, () => console.log('Server is running away!!!'));