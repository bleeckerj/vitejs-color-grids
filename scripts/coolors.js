const chrome = require('chrome-cookies-secure');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;


const url = 'https://www.coolors.co/';

// const getCookies = (callback) => {
//     chrome.getCookies(url, 'puppeteer', function(err, cookies) {
//         if (err) {
//             console.log(err, 'error');
//             return
//         }
//         console.log(cookies, 'cookies');
//         callback(cookies);
//     }, 'Default') // e.g. 'Profile 2'
// }

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

// getCookies(async (cookies) => {
//     const browser = await puppeteer.launch({
//         headless: false
//     });


(async () => {
    const browser = await puppeteer.launch({
                 headless: false
             });
    const page = await browser.newPage();
    const cookiesString = await fs.readFile('./cookies.json');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    var obj = {
        palettes: []
    };
    //await page.setCookie(...[cookies[6]]);
    //await page.goto(url);
    await page.goto('https://coolors.co/generate', {
        waitUntil: 'networkidle2',
      });
  
    //await page.waitUntil(2000)
    console.log("Login or Setup!");

    await delay(10000);

    await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));

    console.log("Continue!");

    var urlPart;

    obj = JSON.parse(await fs.readFile("palettes/palettesJson.json", "utf8"));

    //console.log("DATA: "+JSON.stringify(obj));

    for (let i = 0; i < 40; i++) {
    await page.keyboard.type(' ');
    //console.log(page.url());
    urlPart = page.url().split('/');
    console.log(urlPart[3]);
    var rgbStr = urlPart[3];
    var count = (rgbStr.match(new RegExp("-", "g")) || []).length

    obj.palettes.push({c: count+1, method: "default", rgb: urlPart[3]});

    //await page.screenshot({ path: 'palettes/colors_'+urlPart[3]+'.png'}); 
    //page.waitForSelector('.generator_coolors');
    var el = await page.$('#generator_colors');
    //console.log(el);
    // declare a variable with an ElementHandle
    await el.screenshot({ path: 'palettes/colors_'+urlPart[3]+'.png'})
    await delay(350+Math.round(Math.random()*100));

    }

    // await page.keyboard.type(' ');
    // await delay(100);
    // console.log(page.url());
    // urlPart = page.url().split('/');
    // console.log(urlPart[3]);
    // await page.screenshot({ path: 'colors_'+urlPart[3]+'.png'}); 

    // await page.screenshot({ path: 'colors_'+urlPart[0]+'.png'}); 
    // await page.keyboard.type(' ');
    // await delay(100);
    // console.log(page.url());

    // await page.screenshot({ path: 'space_2.png' });

    await fs.writeFile('palettes/palettesJson.json', JSON.stringify(obj)); // UTF-8 is default


    await delay(500);
    
    browser.close()
})();