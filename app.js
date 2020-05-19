const express = require('express');
const app = express();
const movies = require('./movies');

app.use(express.json());

app.use('/abc', movies);


app.get('/', (req,res) => {
    res.send('Welcome to Daily Code Buffer in Heroku Auto ployment!!');
})



const port = process.env.PORT || '4000';
app.listen(port, () => console.log(`Server started on Port ${port}`));