const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const TikTokScraper = require('tiktok-scraper');
const reqToken = 'AAAAAAAAAAAAAAAAAAAAAKt9EQEAAAAA%2B1rwbmpXwSkxSLPTQFa5An9FxAs%3DVxvx2aYJEEI4l5sDNyHMtHa1rdlwpAtRHCdqhSMP16fzVHES4H';


const route = express.Router();





route.post('/api/tiktok/trend', (req,res) => {
  const category = req.body.category;
  const qty = req.body.qty;

  (async () => {
    try {
        const posts = await TikTokScraper.trend(category, { 
            number: qty
        });
        res.status(200).send({
          trends: posts
        })
        console.log(posts);
    } catch (error) {
      res.status(400).send({
        err: error
      })
    }
    })();
  
  }
)

route.post('/api/tiktok/user', (req,res) => {
  const user = req.body.user;
  (async () => {
    try {
        const hashtag = await TikTokScraper.getUserProfileInfo(user);
        console.log(hashtag);
        res.status(200).send({
          trends: hashtag
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
          err: error
        })
    }
  })();
  
  }
)

// route.post('/api/tiktok/user', (req,res) => {
//   let user = req.body.user

//   axios.get(`https://api.tiktokcounter.com/?type=stats&username=${user}`)
//     .then(data => {
//       console.log(data);
//       res.status(200).send({
//         sc: 1,
//         data: data.data
//       });
//     })
//     .catch(error => {
//       res.status(400).send({
//         sc: 2,
//         data: error
//       });
//     })
//   }
// )

route.post('/api/instagram', (req,res) => {
  let user = req.body.user

  axios.get(`https://www.picuki.com/profile/${user}`)
    .then(data => {
      let ref = data.data.slice(data.data.indexOf('data-followers='), data.data.indexOf('class=\"followed_by'));
      let dp = data.data.slice(data.data.indexOf('profile-hd-link') + 51, data.data.indexOf('data-post-type') - 2);
      var numberPattern = /\d+/g;
      res.status(200).send({
        sc: 1,
        followers: ref.match(numberPattern),
        dp: dp,
      });
    })
    .catch(error => {
      res.status(400).send({
        sc: 2,
        data: error
      });
    })
  }
)

route.post('/api/instagram2', (req,res) => {
  let user = req.body.user

  axios.get(`https://www.instagram.com/${user}/?__a=1`)
    .then(data => {
      // let ref = data.data.slice(data.data.indexOf('data-followers='), data.data.indexOf('class=\"followed_by'));
      // let dp = data.data.slice(data.data.indexOf('profile-hd-link') + 51, data.data.indexOf('data-post-type') - 2);
      // var numberPattern = /\d+/g;
      res.status(200).send({
        sc: 1,
        data: data.data
      });
    })
    .catch(error => {
      res.status(400).send({
        sc: 2,
        data: error
      });
    })
  }
)


route.post('/api/twitter', (req,res) => {
  let config = {
    headers: {
      'Authorization': 'Bearer ' + reqToken
    }
  }
  let user = req.body.user

  axios.get(`https://api.twitter.com/1.1/users/lookup.json?screen_name=${user}`, config)
    .then(data => {
      res.status(200).send({
        sc: 1,
        data: data.data[0]
      });
    })
    .catch(error => {
      res.status(400).send({
        sc: 2,
        data: error
      });
    })
  }
)

route.post('/api/twitter/trending-hashtags', (req,res) => {
  let config = {
    headers: {
      'Authorization': 'Bearer ' + reqToken
    }
  }
  let countryId = req.body.countryId

  axios.get(`https://api.twitter.com/1.1/trends/place.json?id=${countryId}`, config)
    .then(data => {
      res.status(200).send({
        sc: 1,
        data: data.data[0]
      });
    })
    .catch(error => {
      res.status(400).send({
        sc: 2,
        data: error
      });
    })
  }
)




route.post('/api/linkedin', async (req, res) => {
  // console.log(req.body.username);
  let url = req.body.url
  axios.get(url)
  .then(data => {

    var $ = cheerio.load(data.data);
    let title = $(".share-native-video__node").attr('data-sources');
    console.log(title);
    res.status(200).send({
      sc: 1,
      video: title?JSON.parse(title):'err'
    });
  })
  .catch(error => {
    res.status(400).send({
      sc: 2,
      data: error
    });
  })


})





route.post('/api/scrap', async (req, res) => {
  console.log(req.body.website);
  request(req.body.website, async function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var hindiTitle;
      var hindiContent
      let title = $("h2[itemprop=headline]").text();
      let body = $("div.newsDetailedContent").text();
      let tTitle = new Promise(function (resolve, reject) {
          translatte(title, {
            to: 'hi'
          })
          .then( (response) => response.text )
          .then( (data) => {
            hindiTitle = data;
            resolve(hindiTitle);
          })
      });
      let tContent = new Promise(function (resolve, reject) {
        translatte(body, {
          to: 'hi'
        })
        .then( (response) => response.text )
        .then( (data) => {
          hindiContent = data;
          resolve(hindiContent);
        })
    });
      

      if (title && body) {
        setTimeout(() => {
          console.log(hindiTitle);
          console.log(hindiContent);
          
          // res.status(200).send({
          //   heading: hindiTitle,
          //   data: hindiContent
          // })


          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'jokeserotica@gmail.com',
              pass: 'Shivani@123'
            }
          });
    
          var mailOptions = {
            from: 'jokeserotica@gmail.com',
            to: 'himanshu011196.mrkhabari@blogger.com',
            subject: hindiTitle,
            text: hindiContent
          };
    
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              res.send(error);
            } else {
              res.status(200).send({
                sc: 1,
                data: response.text
              });
            }
          });
        },5000)
      }
    }
  });

})

route.get('/api/email', (req, res) => {

  translatte('Do you speak Russian?', {
    to: 'hi'
  }).then(response => {
    console.log(response);
    // res.send('hi');
    if (response) {


      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'jokeserotica@gmail.com',
          pass: 'Shivani@123'
        }
      });

      var mailOptions = {
        from: 'jokeserotica@gmail.com',
        to: 'himanshu011196.netscape@blogger.com',
        subject: 'Sending Email using Node.js',
        text: response.text
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.send(error);
        } else {
          res.status(200).send({
            sc: 1,
            data: response.text
          });
        }
      });








    }
  }).catch(err => {
    console.log(err);
  });



})


route.post('/api/screenshot', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
    const page = await browser.newPage();
    await page.goto(`${req.body.website}`);
    const image = await page.screenshot({
      fullPage: true
    });
    await browser.close();
    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    res.send({
      sc: 0,
      error
    });
  }
})






module.exports = route;