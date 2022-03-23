const puppeteer = require('puppeteer');
//.iubenda-cs-accept-btn iubenda-cs-btn-primary
//class="modal_button-right modal_close-btn btn btn--xs btn--transparent btn--icon"
//class="icon icon-remove-24px"
(async () => {
  //const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });

  const page = await browser.newPage();
  
  page.on('dialog', async (dialog) => {
      console.log("DIALOG")
    await dialog.accept();
  });


  await page.goto('https://coolors.co/817f82-ae8ca3-a2abb5-95d9da-6dd6da', {
      waitUntil: 'networkidle2',
  });
  page.waitForSelector('.iubenda-cs-accept-btn')
  .then(() => console.log('got it'));
  await page.click('.iubenda-cs-accept-btn').then(() => console.log('next shrubbery'));
  await page.waitForSelector('a.modal_close-btn').then(() => console.log('final shrubbery'));
  const element = await page.$('a.modal_close-btn');
//   await page.click('.modal_close-btn');
  //console.log(element);
//   await element.evaluate(ele => ele.click()).then(() => console.log('eh?'));
//  await page.click('.modal_close-btn').then(() => console.log('does that do it?'));
  //await page.click('.modal_button-right modal_close-btn btn btn--xs btn--transparent btn--icon').then(() => console.log('and the last shrubbery'));

  //browser.close();

//   page.on('dialog', async dialog => {
//     console.log(dialog.message());
//     await dialog.dismiss();
//     await browser.close();
//   });
   await page.screenshot({ path: 'example.png' });

   await browser.close();
})();