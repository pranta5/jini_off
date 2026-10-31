const {chromium}=require('C:/Users/prant/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs=require('fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///C:/jini%20web/office%20jini/chatbot/index.html');
 async function loadImages(){await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>{im.loading='eager';return im.decode().catch(()=>{});}));});}
 await loadImages();
 assert.equal(await page.locator('.solution-card').count(),6);
 for(let i=0;i<7;i++){await page.locator(`[data-industry="${i}"]`).click();await loadImages();assert.match(await page.locator('#industry-image').getAttribute('src'),new RegExp(`industry-${i}`));assert.equal(await page.locator('.industry-detail:visible').count(),1);}
 await page.locator('[data-industry="1"]').click();
 for(let i=0;i<4;i++){await page.locator(`[data-capability="${i}"]`).click();if(i<3)assert.equal(await page.locator('.feature-card').count(),6);else for(let j=0;j<4;j++){await page.locator(`[data-model="${j}"]`).click();await loadImages();assert.match(await page.locator('#model-panel img').getAttribute('src'),new RegExp(`models-${j}`));}}
 await page.screenshot({path:'tmp/pdfs/models.png',fullPage:false});
 await page.locator('[data-capability="0"]').click();
 await page.locator('.faq-item summary').first().click();assert.equal(await page.locator('.faq-item[open]').count(),1);
 await page.locator('.faq-item summary').nth(1).click();
 for(const cta of await page.locator('[data-consult]').all()){await cta.click();assert(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');assert(!(await page.locator('dialog').isVisible()));}
 await page.locator('[data-consult]').first().click();
 await page.locator('#modal-name').fill('Test User');await page.locator('#modal-email').fill('test@example.com');await page.locator('#modal-phone').fill('+1 555 0100');await page.locator('#modal-consent').check();await page.locator('#modal-consultation button').click();assert.match(await page.locator('#modal-consultation .form-status').textContent(),/not been sent/);
 await page.screenshot({path:'tmp/pdfs/modal.png'});await page.locator('.dialog-close').click();
 await page.locator('#hero-form input[name="name"]').fill('Sample Name');await page.locator('#hero-form input[name="email"]').fill('sample@example.com');await page.locator('#hero-form button').click();assert.equal(await page.locator('#modal-name').inputValue(),'Sample Name');await page.keyboard.press('Escape');
 for(let i=0;i<4;i++){await page.locator(`[data-chat="${i}"]`).click();assert.equal(await page.locator(`[data-chat="${i}"]`).getAttribute('aria-current'),'true');}
 await page.locator('[data-chat="0"]').click();
 const results=[];
 for(const width of [1920,1440,1280,1024,768,390,320]){
  await page.setViewportSize({width,height:1000});await loadImages();
  const result=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,broken:[...document.images].filter(im=>!im.complete||!im.naturalWidth).map(im=>im.src),images:[...document.images].filter(im=>im.getBoundingClientRect().width>0).map(im=>({src:im.getAttribute('src'),w:im.getBoundingClientRect().width,h:im.getBoundingClientRect().height,nw:im.naturalWidth,nh:im.naturalHeight}))}));
  assert(result.scrollWidth<=width,`Overflow at ${width}: ${result.scrollWidth}`);assert.equal(result.broken.length,0);results.push(result);
  if([1440,768,390].includes(width)){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`tmp/pdfs/verified-${width}.png`,fullPage:true});}
 }
 assert.equal(errors.length,0,errors.join('\n'));
 fs.writeFileSync('tmp/pdfs/verification.json',JSON.stringify({errors,results},null,2));
 console.log('PASS: 7 responsive widths, all images, 7 industries, 4 capability tabs, 4 model tabs, FAQ, modal opening/closing, form validation and prefilling, all chat states.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
