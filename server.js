// server.js
import express from 'express'; // import express with ES Modules
const app = express(); // create instance of Express app
const dirname = import.meta.dirname; // get dirname

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
app.listen(8000, () => console.log('Server is running away!!!'));