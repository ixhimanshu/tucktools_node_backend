const express = require('express');
const app = express();
const movies = require('./movies');


const corsOptions = {
    origin: 'https://www.tucktools.com',
    optionsSuccessStatus: 200
  }

  app.use(express.json());


app.get('/', (req,res) => {
  res.send('Welcome to Tucktools.com!');
})


app.use('/v1', movies);





const port = process.env.PORT || '4000';
app.listen(port, () => console.log(`Server started on Port ${port}`));



