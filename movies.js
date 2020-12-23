const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const translatte = require('translatte');
const request = require('request');
const cheerio = require('cheerio');
const TikTokScraper = require('tiktok-scraper');
const reqToken = 'AAAAAAAAAAAAAAAAAAAAAKt9EQEAAAAA%2B1rwbmpXwSkxSLPTQFa5An9FxAs%3DVxvx2aYJEEI4l5sDNyHMtHa1rdlwpAtRHCdqhSMP16fzVHES4H';



const options = {
  // Number of posts to scrape: {int default: 20}
  number: 50,

  // Set proxy {string[] | string default: ''}
  // http proxy: 127.0.0.1:8080
  // socks proxy: socks5://127.0.0.1:8080
  // You can pass proxies as an array and scraper will randomly select a proxy from the array to execute the requests
  proxy: '',

  // Set to {true} to search by user id: {boolean default: false}
  by_user_id: false,

  // How many post should be downloaded asynchronously. Only if {download:true}: {int default: 5}
  asyncDownload: 5,

  // How many post should be scraped asynchronously: {int default: 3}
  // Current option will be applied only with current types: music and hashtag
  // With other types it is always 1 because every request response to the TikTok API is providing the "maxCursor" value
  // that is required to send the next request
  asyncScraping: 3,

  // File path where all files will be saved: {string default: 'CURRENT_DIR'}
  filepath: `CURRENT_DIR`,

  // Custom file name for the output files: {string default: ''}
  fileName: `CURRENT_DIR`,

  // Output with information can be saved to a CSV or JSON files: {string default: 'na'}
  // 'csv' to save in csv
  // 'json' to save in json
  // 'all' to save in json and csv
  // 'na' to skip this step
  filetype: `na`,

  // Set custom headers: user-agent, cookie and etc
  // NOTE: When you parse video feed or single video metadata then in return you will receive {headers} object
  // that was used to extract the information and in order to access and download video through received {videoUrl} value you need to use same headers
  headers: {
      'User-Agent': "BLAH",
      Referer: 'https://cors-anywhere.herokuapp.com/https://www.tiktok.com/',
      Cookie: `tt_webid_v2=68dssds`,
  },
  
  // Download video without the watermark: {boolean default: false}
  // Set to true to download without the watermark
  // This option will affect the execution speed
  noWaterMark: false,
  
  // Create link to HD video: {boolean default: false}
  // This option will only work if {noWaterMark} is set to {true}
  hdVideo: false,

  // verifyFp is used to verify the request and avoid captcha
  // When you are using proxy then there are high chances that the request will be 
  // blocked with captcha
  // You can set your own verifyFp value or default(hardcoded) will be used
  verifyFp: ''
};

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




route.post('/api/youtube', async (req, res) => {
  // console.log(req.body.username);
  request('https://youtube.com/c/AmitTiwari/about', async function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      // let title = $("body div.share-native-video").html();
      // // console.log(abc);
      let title = $("body #masthead-container").text()
      console.log(title);
      // const reg = /[<>]/g;
      // const reg2 = /&quot;/g
      // let abc = title.replace(reg);
      // let myHtml = abc.substr(abc.indexOf('[') + 1, abc.indexOf(']', 40) - 72).split(',')[0];
      // const url = myHtml.substr(myHtml.indexOf('http'), myHtml.length - 15);
      // console.log(typeof myHtml);
      res.send({
        video_url: title
      });
    }
  });

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