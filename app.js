const express = require('express');
const app = express();
const movies = require('./movies');

app.use(express.json());

app.use('/v1', movies);


app.get('/', (req,res) => {
    res.send('Welcome to Tucktools.com!');
})



const port = process.env.PORT || '4000';
app.listen(port, () => console.log(`Server started on Port ${port}`));