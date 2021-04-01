const express = require('express');
const app = express();
const movies = require('./routes/movies');
const mysqlapi = require('./routes/mysqlapi');
const cors = require('cors');

app.use(express.json());

const corsOptions = {
  origin: 'https://www.tucktools.com',
  optionsSuccessStatus: 200
}

app.use('/v1',cors(corsOptions), movies);
app.use('/mysql',cors(corsOptions), mysqlapi);



app.get('/', (req,res) => {
  res.send('Welcome to Tucktools.com!');
})




const port = process.env.PORT || '4000';
app.listen(port, () => console.log(`Server started on Port ${port}`));



