const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const TikTokScraper = require('tiktok-scraper');
const nodemailer = require('nodemailer');
const reqToken = 'AAAAAAAAAAAAAAAAAAAAAKt9EQEAAAAA%2B1rwbmpXwSkxSLPTQFa5An9FxAs%3DVxvx2aYJEEI4l5sDNyHMtHa1rdlwpAtRHCdqhSMP16fzVHES4H';
// const functions = require('firebase-functions');
const request = require('request');

const route = express.Router();


const options = {
  // Number of posts to scrape: {int default: 20}
  number: 50,
  
  // Set session: {string[] default: ['']}
  // Authenticated session cookie value is required to scrape user/trending/music/hashtag feed
  // You can put here any number of sessions, each request will select random session from the list
  sessionList: ['sid_tt=21312213'],

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
      'user-agent': "Mozilla%2F5.0+(Windows+NT+10.0%3B+Win64%3B+x64)+AppleWebKit%2F537.36+(KHTML,+like+Gecko)+Chrome%2F89.0.4389.128+Safari%2F537.36",
      referer: 'https://www.tiktok.com/',
      cookie: `tt_webid_v2=68dssds`,
      app_name: 'tiktok_web',
      _signature: '_02B4Z6wo00101iZpO8gAAIDA-i1GuDfk4MYmaT9AAOkp1d'
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
      const user = await TikTokScraper.getUserProfileInfo('lorangray', options);
      console.log(req.body.user);
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

route.post('/api/tiktok2', (req,res) => {
  let user = req.body.user

  axios.get(`https://api.tiktokcounter.com/?type=history&username=${user}`)
    .then(data => {
      res.status(200).send({
        sc: 1,
        data: data.data.data
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

route.post('/api/tiktok2/dp', (req,res) => {

  let user = req.body.user
  request(`https://brainans.com/user/jlo`, async function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      let dp = $(".user__img").attr('style');
      res.status(200).send({
        sc: 1,
        data: dp
      });
   
    } else {
      res.status(400).send({
        sc: 0,
        data: error.error
      });
    }
  });
})


route.post('/api/instagram', (req,res) => {
  let user = req.body.user

  axios.get(`https://www.picuki.com/profile/${user}`)
    .then(data => {
      let ref = data.data.slice(data.data.indexOf('data-followers='), data.data.indexOf('class=\"followed_by'));
      let dp = data.data.slice(data.data.indexOf('profile-hd-link') + 51, data.data.indexOf('data-post-type') - 2);
      var numberPattern = /\d+/g;
      res.status(200).send({
        sc: 1,
        // data: data.data,
        followers: ref.match(numberPattern),
        dp: "https://www.picuki.com" + dp,
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

route.post('/api/instagram3', async (req,res) => {
  try {
    const browser = await playwright['webkit'].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.instagram.com/accounts/login/');

    await page.waitForSelector('[type=submit]', {
      state: 'visible',
    });

    await page.type('[name=username]', 'tucktools'); // ->
    await page.type('[type="password"]', 'Shivani@123'); // ->

    await page.click('[type=submit]');
    await page.waitForSelector('[placeholder=Search]', { state: 'visible' });
    await page.goto(`https://www.instagram.com/${req.body.user}`); // ->

    // Execute code in the DOM
    const details = await page.evaluate(() => {
      const resObj = {
        posts: 0,
        followers: 0,
        following: 0,
        dp: ''
      };
      const images = document.querySelectorAll('#react-root section main div header section ul li');
      images.forEach((e,index) => {
        if(index == 0) {
          resObj.posts = e.querySelector('span').innerText.slice(0, -6);;
        } else if(index == 1) {
          resObj.followers = e.querySelector('a span').getAttribute('title');
        } else{
          resObj.following = e.querySelector('a span').innerText;
        }
      })
      resObj.dp = document.querySelector('#react-root section main div header div div span img').getAttribute('src');
      return resObj;
    });
    await browser.close();
    return res.status(200).json({
      details
    });
    
  } catch (error) {
    console.log(error);
    res.send({
      sc: 0,
      error: error
    });
  }

})

route.post('/api/instagram4', (req,res) => {
  let user = req.body.user
  const data = {"signed_body":"c2e102532a040b4e4cbcb4be521098b948c75ff587d9b4f93540a42ffbfc1375.{\"ins_account\":\"tuck\",\"system_id\":2}",
  "sign_version":1}
  axios.post(`https://www.insfollowup.com/api/ins/getaccountbyusername`, JSON.parse(JSON.stringify(data).replace('tuck', user)))
    .then(data => {
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

route.post('/api/image', async (req,res) => {
  let url = req.body.url

  axios.get(url)
    .then(data => {
      var $ = cheerio.load(data.data);
     
      const list = [];
      $('img').each(function (index, element) {
         const a = $(element).attr('src');
         if(a.indexOf('./') > -1) {
          list.push(a.slice(a.lastIndexOf('./'), a.length).replace('.', url))
         } else {
           list.push(a)
         }
      });
      // console.log(title);
      res.status(200).send({
        sc: 1,
        link: list
      });
    })
    .catch(error => {
      res.status(400).send({
        sc: 0,
        data: error
      });
    })

})


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

route.post('/api/email', (req, res) => {

  (async () => {
    try {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'jokeserotica@gmail.com',
          pass: 'Shivani@123'
        }
      });

      var mailOptions = {
        from: 'jokeserotica@gmail.com',
        to: 'himanshuthakur.cse.iimtgn@gmail.com',
        subject: `${req.body.review} : ${req.body.tool}`,
        text: JSON.stringify(req.body)
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.send(error);
        } else {
          res.status(200).send({
            sc: 1,
            data: 'success'
          });
        }
      });
    } catch (error) {
        console.log(error);
        res.status(400).send({
          err: error
        })
    }
  })();
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