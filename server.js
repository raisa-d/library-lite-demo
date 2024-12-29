// server.js
import express from 'express'; // import express with ES Modules
const app = express(); // create instance of Express app
const dirname = import.meta.dirname; // get dirname

// MIDDLEWARE - next step in article
// app.use(express.static('public'));

// handle GET request
app.get('/', (request, response) => {
    response.sendFile(`${dirname}/index.html`);
})

// have server listen on PORT
app.listen(8000, () => console.log('Server is running away!!!'))