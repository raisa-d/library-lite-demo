// server.js
// import express with ES Modules
import express from 'express';

// create instance of Express app
const app = express();

// handle GET request
app.get('/', (request, response) => {
    response.send('If you can see this, the server sent a response!')
})

// have server listen on PORT
app.listen(8000, () => console.log('Server is running away!!!'))