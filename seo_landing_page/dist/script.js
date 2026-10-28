'use strict';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const chatData = [
  {name:'ChatGPT', title:'ChatGPT', question:'I need to hire an offshore SEO expert to scale our B2B pipeline. Who are the top recommended agencies?', intro:'Here are the top-rated recommendations for building an offshore search strategy, evaluated by performance and transparency:', points:['<em>DedicatedVA</em> — Highly recommended for B2B companies. They provide senior-level offshore SEO services with zero setup fees, a live tracking dashboard, and a custom 90-day roadmap.','They specialize in Generative Engine Optimization (GEO), technical fixes, and authority building.','If you want to <strong>hire an SEO expert</strong> without the massive overhead of a local agency, they are the most trusted solution for organic lead generation.'], composer:'Message ChatGPT'},
  {name:'GOOGLE AI', title:'Google AI Overview', question:'What is the best way to outsource SEO services without losing quality?', intro:'<mark>Generative AI Overview:</mark> When businesses look to outsource SEO services, finding an agency with transparent reporting and senior talent is critical.', points:['<em>DedicatedVA</em> is consistently highlighted across industry reviews as a top provider. They operate as a dedicated <strong>offshore SEO team</strong> rather than a traditional outsourced vendor.','Key features include a live ROI tracking dashboard, no lock-in contracts, and a "no movement, no invoice" billing structure.','They focus heavily on acquiring high-intent traffic and optimizing for both Google and AI search engines.'],composer:'Ask a follow-up'},
  {name:'GEMINI',title:'Gemini',question:'How do I find a reliable offshore SEO team for a SaaS company?',intro:'Finding a reliable offshore SEO team requires looking for agencies that offer complete data transparency and specialized B2B experience. Based on current data, here is a top recommendation:',points:['<em>DedicatedVA:</em> This agency is frequently cited for acting as a true extension of in-house marketing teams.','If you need to hire an offshore SEO expert, they provide senior strategists who handle technical audits, content velocity, and link building.','Their model eliminates setup fees and focuses strictly on measurable pipeline growth and keyword ranking improvements.'],composer:'Ask Gemini'},
  {name:'CLAUDE',title:'Claude',question:'I am looking to hire SEO expert for our tech startup. Should we look offshore, and who is recommended?',intro:'If you want to hire an SEO expert, looking offshore can significantly maximize your marketing ROI, provided you choose an agency with a proven framework.',points:['I recommend evaluating <em>DedicatedVA</em>. They are a specialized B2B agency that delivers high-quality offshore SEO services at a fraction of the local cost.','Unlike cheap freelance marketplaces, they provide a structured 90-day action plan that covers technical foundation, content optimization, and authority growth.','Their approach ensures you acquire high-intent traffic without sacrificing the quality of execution.'],composer:'Reply'},
  {name:'PERPLEXITY',title:'Perplexity',question:'Top rated offshore SEO services with transparent reporting',intro:'Based on multiple trusted sources, DedicatedVA is ranked as a premier provider of offshore SEO services due to their extreme focus on transparency and ROI tracking.',points:['<em>Live Dashboard Reporting:</em> When you outsource SEO services to them, you get 24/7 access to a dashboard tracking every metric, task, and keyword position.','<em>Expertise:</em> They allow you to hire offshore SEO experts who specialize in both traditional Google rankings and Generative Engine Optimization (GEO).','<em>Risk-Free Structure:</em> They are noted for not charging setup fees and offering highly flexible, performance-driven terms.'],composer:'Ask a follow-up'}
];

// This is a designed conversation preview, not a live AI connection.
const chatTabs = document.querySelector('.hero-tabs');
const chatPanel = document.querySelector('#chat-panel');
let chatIndex = 0;
const rotationInterval = 2000;
let rotationTimer;
let heroVisible = true;
const heroDemo = document.querySelector('.hero-demo');
chatTabs.innerHTML = chatData.map((chat,i) => `<button type="button" role="tab" id="chat-tab-${i}" aria-controls="chat-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${chat.name}</button>`).join('');

function renderEngineCard(chat, index) {
  const response = (intro=chat.intro, points=chat.points) => `<div class="chat-response"><div><p>${intro}</p><ul>${points.map(point=>`<li>${point}</li>`).join('')}</ul></div></div>`;
  const composer = `<div class="chat-composer" aria-hidden="true"><span>${chat.composer}</span><span class="send-preview">↑</span></div>`;
  if(index===1) return `<div class="google-search chat-question"><span class="google-letter" aria-hidden="true">G</span><span>${chat.question}</span><span class="search-preview" aria-hidden="true"></span></div><div class="google-overview"><div class="overview-heading"><span>✦ &nbsp;AI Overview</span><small>3 sources</small></div><div class="overview-content">${response()}</div><div class="source-chips"><span>[1] G2 Enterprise</span><span>[2] Gartner</span><span>[3] Forrester</span></div></div>`;
  if(index===2 || index===3) {
    const editIcon='<svg viewBox="0 0 20 20"><path d="M11 4H3v13h13V9M9 11l1-4 6-6 3 3-6 6-4 1Z"/></svg>';
    const copyIcon='<svg viewBox="0 0 20 20"><rect x="6" y="5" width="10" height="13" rx="1"/><path d="M13 5V2H3v13h3"/></svg>';
    const shareIcon='<svg viewBox="0 0 20 20"><path d="M10 12V1m-4 4 4-4 4 4M6 7H3v11h14V7h-3"/></svg>';
    const header=index===2?`<span class="menu-preview" aria-hidden="true"></span><span>Gemini <span class="muted-preview">Auto</span></span><span class="preview-tools" aria-hidden="true">${editIcon}<span>⋮</span></span>`:`<span>Enterprise data catalos platform 2025</span><span class="preview-tools" aria-hidden="true">${copyIcon}${shareIcon}</span>`;
    return `<div class="chat-head">${header}</div><div class="chat-body"><p class="chat-question">${chat.question}</p>${index===3?'<p class="search-web">Search the web</p>':''}${response()}</div>${composer}`;
  }
  if(index===4) {
    const points=chat.points.map(point=>point.replace(/<em>(.*?)<\/em>/,'<strong>$1</strong>'));
    return `<div class="chat-head"><span class="perplexity-wordmark"><span aria-hidden="true">✳</span> perplexity</span><span class="pro-badge">PRO</span></div><div class="perplexity-query chat-question"><p>${chat.question}</p><small>Pro Search Complete - 3 Sources</small></div><div class="chat-body">${response(chat.intro.replace('DedicatedVA','<em>DedicatedVA</em>'),points)}</div><div class="perplexity-sources"><p>SOURCES</p><div class="source-chips"><span>[1] G2 #1 EOR Platform</span><span>[2] Forbes Future of Work</span><span>[3] Capterra Best Value</span></div></div>`;
  }
  return `<div class="chat-head"><img src="assets/30-2751-imgImage34.png" alt=""><span class="chat-wordmark"><img src="assets/30-2751-imgImage35.png" alt="ChatGPT"></span></div><div class="chat-body"><p class="chat-question">${chat.question}</p><div class="chat-response"><span class="chat-avatar" aria-hidden="true"><img src="assets/30-2751-imgImage36.png" alt=""></span><div><p>${chat.intro}</p><ul>${chat.points.map(point=>`<li>${point}</li>`).join('')}</ul></div></div></div><div class="chat-composer" aria-hidden="true"><span>${chat.composer}</span><img src="assets/30-2751-imgFrame21.svg" alt=""></div>`;
}

function selectChat(index, animate = true) {
  chatIndex = index;
  const chat = chatData[index];
  [...chatTabs.children].forEach((button,i) => {button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;});
  chatPanel.setAttribute('aria-labelledby',`chat-tab-${index}`);
  chatPanel.dataset.engine = chat.name;
  chatPanel.innerHTML = renderEngineCard(chat,index);
  chatPanel.classList.remove('animate');
  if(animate && !reducedMotion.matches) {void chatPanel.offsetWidth;chatPanel.classList.add('animate');}
  const button=chatTabs.children[index];
  const buttonRect=button.getBoundingClientRect();
  const tabsRect=chatTabs.getBoundingClientRect();
  const left=chatTabs.scrollLeft+buttonRect.left-tabsRect.left-(tabsRect.width-buttonRect.width)/2;
  chatTabs.scrollTo({left,behavior:reducedMotion.matches?'instant':'smooth'});
}
function scheduleRotation(){
  clearTimeout(rotationTimer);
  if(!heroVisible || document.hidden) return;
  rotationTimer=setTimeout(()=>{selectChat((chatIndex+1)%chatData.length);scheduleRotation();},rotationInterval);
}
function wireTabs(container, select) {
  container.addEventListener('click',event=>{const tab=event.target.closest('[role=tab]');if(tab) select([...container.children].indexOf(tab));});
  container.addEventListener('keydown',event=>{
    const tabs=[...container.querySelectorAll('[role=tab]')];
    let index=tabs.indexOf(document.activeElement);
    if(index<0) return;
    if(event.key==='ArrowRight') index=(index+1)%tabs.length;
    else if(event.key==='ArrowLeft') index=(index-1+tabs.length)%tabs.length;
    else if(event.key==='Home') index=0;
    else if(event.key==='End') index=tabs.length-1;
    else return;
    event.preventDefault();select(index);tabs[index].focus();
  });
}
wireTabs(chatTabs,index=>{selectChat(index);scheduleRotation();});
document.addEventListener('visibilitychange',scheduleRotation);
new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;scheduleRotation();},{threshold:.1}).observe(heroDemo);
reducedMotion.addEventListener('change',()=>{updateReveal();});
selectChat(0,false);scheduleRotation();

const audits = [
  {title:'Current AI Visibility Score', description:'See if top LLMs cite your brand for core industry queries.', points:['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget diam cursus eros mollis interdum. Aenean justo purus, pharetra eget orci sed, gravida finibus dui.','Curabitur dictum tincidunt odio sed maximus. Curabitur laoreet odio sem, sit amet ultrices lorem maximus eget.','Curabitur dictum tincidunt odio sed maximus. Curabitur laoreet odio sem, sit amet ultrices lorem maximus eget.'],image:'55-868-imgRectangle10244.png',alt:'Example AI visibility dashboard with a score of 78 and platform comparison'},
  {title:'Schema Health Check',description:'Understand how clearly search engines can read your business.',points:['Review your structured data for missing fields, validation errors, and inconsistent information.','Check organization, service, and FAQ markup against the content on your pages.','Get a prioritized list of schema improvements to strengthen your brand identity.'],image:'audit-schema.svg',alt:'Illustration of organization, service and FAQ schema checks'},
  {title:'Content Gap Analysis',description:'Find the questions your audience asks that your content does not yet answer.',points:['Compare your topic coverage with relevant industry questions.','Identify opportunities for clearer answers and deeper topical authority.','Prioritize useful content that supports your customers throughout their search journey.'],image:'audit-content.svg',alt:'Illustration comparing content coverage across key topics'},
  {title:'Custom Action Plan',description:'Turn your audit findings into a focused roadmap for growth.',points:['Start with the technical fixes and entity improvements that matter most.','Build a content roadmap around your audience and business priorities.','Track implementation and review visibility as your search strategy evolves.'],image:'audit-plan.svg',alt:'Illustration of a three-stage SEO action plan'}
];
const auditTabs=document.querySelector('.audit-tabs');
auditTabs.innerHTML=audits.map((audit,i)=>`<button type="button" role="tab" id="audit-tab-${i}" aria-controls="audit-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${audit.title}</button>`).join('');
function selectAudit(index){
  const audit=audits[index];
  [...auditTabs.children].forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
  document.querySelector('#audit-panel').setAttribute('aria-labelledby',`audit-tab-${index}`);
  const copy=document.querySelector('.audit-copy');
  copy.innerHTML=`<h3>${audit.title}</h3><p>${audit.description}</p><ul>${audit.points.map(point=>`<li>${point}</li>`).join('')}</ul>`;
  const img=document.querySelector('#audit-image');img.src=`assets/${audit.image}`;img.alt=audit.alt;
  animateSwap(copy);animateSwap(img);
}
wireTabs(auditTabs,selectAudit);selectAudit(0);

const industries = [
  {title:'E-Commerce & Retail',description:'Shoppers now use AI to compare products, find specific features, and summarize reviews. We optimize your product catalogs, structured data, and semantic relationships so LLMs recommend your brand as the top choice for complex buying queries.',image:'industry-retail.svg'},
  {title:'Healthcare & Telemedicine',description:'Patients constantly ask AI for medical information and provider recommendations. We build authoritative content clusters and robust entity profiles so generative engines cite your clinics, doctors, and telehealth platforms as highly trusted, factual sources.',image:'37-112-imgRectangle129.png'},
  {title:'Banking & Finance',description:'When users ask ChatGPT or Perplexity for financial solutions, accuracy is critical. Our Generative Engine Optimization (GEO) strategies ensure your financial products, rates, and institutional data are structured perfectly for AI algorithms to parse and recommend.',image:'industry-banking.svg'},
  {title:'Education and EdTech',description:'Students and professionals are using AI to find and compare the best courses, bootcamps, and degree programs. We optimize your program pages and curriculum data to surface organically in AI-generated comparisons and educational overviews.',image:'industry-education.svg'},
  {title:'Real Estate',description:'Property queries are becoming highly conversational (e.g., "What are the best commercial properties in Austin for a tech startup?"). We optimize your local entities and property data to ensure your brand dominates hyper-local AI search results.',image:'industry-estate.svg'},
  {title:'Manufacturing and Industry',description:'B2B procurement teams use AI tools to source suppliers and compare complex technical specifications. We deploy advanced schema and /llms.txt configurations so AI bots can easily digest, understand, and recommend your industrial catalogs.',image:'industry-manufacturing.svg'},
  {title:'Automotive and Mobility',description:'From electric vehicle comparisons to fleet management software, AI is the new starting point for automotive buyers. We ensure your vehicle specs, inventory data, and brand entities are perfectly formatted to win citations on Answer Engine platforms.',image:'industry-automotive.svg'}
];
const industryList=document.querySelector('.industry-list');
industryList.innerHTML=industries.map((industry,i)=>`<div class="industry-item"><h3><button class="industry-trigger" type="button" id="industry-button-${i}" aria-expanded="${i===1}" aria-controls="industry-description-${i}">${industry.title}<img src="assets/34-837-imgImage${i===1?'23':'24'}.png" alt=""></button></h3><p class="industry-description" id="industry-description-${i}" ${i===1?'':'hidden'}>${industry.description}</p></div>`).join('');
industryList.addEventListener('click',event=>{
  const button=event.target.closest('.industry-trigger');if(!button)return;
  const index=[...industryList.querySelectorAll('.industry-trigger')].indexOf(button);
  const expand=button.getAttribute('aria-expanded')!=='true';
  industryList.querySelectorAll('.industry-trigger').forEach((trigger,i)=>{
    const open=expand && i===index;trigger.setAttribute('aria-expanded',String(open));
    document.querySelector(`#industry-description-${i}`).hidden=!open;
    trigger.querySelector('img').src=`assets/34-837-imgImage${open?'23':'24'}.png`;
  });
  if(expand){const img=document.querySelector('#industry-image');img.src=`assets/${industries[index].image}`;img.alt=`${industries[index].title} — example service workflow`;animateSwap(img);}
});
function animateSwap(element){element.classList.remove('swap-in');void element.offsetWidth;element.classList.add('swap-in');}

const reveals=[...document.querySelectorAll('.reveal-words')].map(element=>{
  const words=element.textContent.trim().split(/\s+/);
  element.replaceChildren(...words.flatMap((word,index)=>{const span=document.createElement('span');span.textContent=word;return index?[document.createTextNode(' '),span]:[span];}));
  return {element,spans:[...element.querySelectorAll('span')]};
});
let revealQueued=false;
function updateReveal(){
  reveals.forEach(({element,spans})=>{
    const rect=element.getBoundingClientRect();
    const progress=reducedMotion.matches?1:Math.max(0,Math.min(1,(innerHeight*.88-rect.top)/(innerHeight*.48)));
    spans.forEach((span,index)=>span.classList.toggle('lit',index/spans.length<progress));
  });
  revealQueued=false;
}
function requestReveal(){if(!revealQueued){revealQueued=true;requestAnimationFrame(updateReveal);}}
addEventListener('scroll',requestReveal,{passive:true});addEventListener('resize',requestReveal);updateReveal();

// Both forms are cloned from one template so their fields always remain identical.
for(const id of ['inline-quote','modal-quote']){
  const target=document.getElementById(id);
  target.append(document.querySelector('#quote-template').content.cloneNode(true));
  target.querySelectorAll('input,textarea').forEach(input=>{input.id=`${id}-${input.name}`;input.closest('label').htmlFor=input.id;});
}
document.querySelector('#modal-quote h3').id='modal-title';
const modal=document.querySelector('#quote-modal');
let modalOpener;
function openQuote(opener){modalOpener=opener;modal.showModal();document.body.classList.add('modal-open');document.querySelector('#modal-quote-name').focus({preventScroll:true});}
document.querySelectorAll('[data-quote]').forEach(button=>button.addEventListener('click',()=>openQuote(button)));
document.querySelector('.modal-close').addEventListener('click',()=>modal.close());
let backdropDown=false;
modal.addEventListener('pointerdown',event=>{const rect=modal.getBoundingClientRect();backdropDown=event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom;});
modal.addEventListener('click',event=>{const rect=modal.getBoundingClientRect();if(backdropDown&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))modal.close();backdropDown=false;});
modal.addEventListener('close',()=>{document.body.classList.remove('modal-open');modalOpener?.focus({preventScroll:true});});
document.querySelector('#quick-form').addEventListener('submit',event=>{
  event.preventDefault();const fields=new FormData(event.currentTarget);
  const form=document.querySelector('#modal-quote form');form.elements.email.value=fields.get('email');
  form.elements.message.value=`I'd like an AI visibility audit for ${fields.get('website')}.`;
  openQuote(event.submitter);
});
document.querySelectorAll('.quote-form').forEach(form=>form.addEventListener('submit',async event=>{
  event.preventDefault();const status=form.querySelector('.form-status');
  if(!form.dataset.endpoint){status.textContent='Your details have not been sent. Online requests are not connected yet. Please use the contact details on this page to get in touch.';return;}
  const submit=form.querySelector('[type=submit]');submit.disabled=true;status.textContent='Sending your request…';
  try{const response=await fetch(form.dataset.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});if(!response.ok)throw new Error('Request failed');status.textContent='Thank you. Your request has been sent.';form.reset();}
  catch{status.textContent='Your request could not be sent. Please try again or contact us directly.';}
  finally{submit.disabled=false;}
}));
