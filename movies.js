const express = require('express');
const puppeteer = require('puppeteer');

const route = express.Router();


const movies = [{
        id: 1,
        name: 'Star Wars'
    },
    {
        id: 2,
        name: 'Star Trek'
    },
    {
        id: 3,
        name: 'Toy Story'
    },
    {
        id: 4,
        name: 'Transformers'
    },
    {
        id: 5,
        name: 'Terminator'
    }
]

route.get('/api/movies', (req, res) => {
    res.send(movies);
})
route.get('/api/movies/:id', async (request, response) => {
  
        try {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox']
            });
            const page = await browser.newPage();
            await page.goto("http://google.com");
            const image = await page.screenshot({
                fullPage: true
            });
            await browser.close();
            response.set('Content-Type', 'image/png');
            response.send(image);
        } catch (error) {
            console.log(error);
        }
})
// route.get('/api/movies/:id', (req,res) =>{
//     // let movie = movies.find(c => c.id === parseInt(req.params.id) )
//     // if(!movie) res.send(`No movie found for the Id : ${req.params.id}`);
//     // res.send(movie);
//     doScreenCapture(`https://www.${req.params.id}`, 'capture')

//     async function doScreenCapture(url2, site_name) {
//       const browser = await puppeteer.launch();
//       const page = await browser.newPage();
//       await page.goto(url2, {
//           waitUntil: 'domcontentloaded'
//       });
//       await page.screenshot({
//           fullPage: true
//       }).then((result) => {
//           let img = result.toString('base64');
//           res.send({
//               status: 200,
//               dataSet: img
//           })
//       }).catch(err => {
//         console.log(err);
//         res.sendStatus(500);
//       });
//       await browser.close();
//       }
// })

route.post('/api/movies', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const result = schema.validate(req.body);
    console.log(result);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let movie = {
        id: movies.length + 1,
        name: req.body.name
    }
    movies.push(movie);
    res.send(movie);
})

route.put('/api/movies/:id', (req, res) => {

    let movie = movies.find(c => c.id === parseInt(req.params.id))
    if (!movie) res.send(`No movie found for the Id : ${req.params.id}`);


    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const result = schema.validate(req.body);
    console.log(result);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    movie.name = req.body.name;
    res.send(movie);
})


route.use('/api/movies', (req, res, next) => {
    console.log(req.url, req.method)
    next();
})

route.delete('/api/movies/:id', (req, res) => {

    let movie = movies.find(c => c.id === parseInt(req.params.id))
    if (!movie) res.send(`No movie found for the Id : ${req.params.id}`);

    const index = movies.indexOf(movie);
    movies.splice(index, 1);

    res.send(movie);
})



module.exports = route;