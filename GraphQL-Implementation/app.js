const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// get request is getting routed to Hello World!
app.get('/', (req,res,next) => {
    res.send('Hello World!');
})

app.listen(3030);