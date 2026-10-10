'use strict';
(() => {
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const template = document.getElementById('consultation-form-template');
function createForm(hostId,prefix) {
 const fragment=template.content.cloneNode(true);
 fragment.querySelectorAll('[data-field]').forEach(field=>{field.id=prefix+'-'+field.dataset.field;});
 fragment.querySelectorAll('[data-for]').forEach(label=>{label.htmlFor=prefix+'-'+label.dataset.for;});
 const form=fragment.querySelector('form');
 const status=form.querySelector('.form-status');
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const nameField=form.elements.fullName, phoneField=form.elements.phone;
  nameField.setCustomValidity(nameField.value.trim() ? '' : 'Please enter your full name.');
  phoneField.setCustomValidity(phoneField.value.trim() ? '' : 'Please enter your phone number.');
  form.classList.add('was-validated');
  if(!form.checkValidity()){status.hidden=true;form.querySelector(':invalid')?.focus();return;}
  status.textContent='Demo complete—your enquiry has not been sent';
  status.hidden=false;
 });
 form.addEventListener('input',event=>{
  if(event.target.matches('[data-field="name"],[data-field="phone"]'))event.target.setCustomValidity('');
  status.hidden=true;
 });
 document.getElementById(hostId).append(fragment);
}
createForm('hero-form-host','hero');
createForm('modal-form-host','modal');
const faqQuestions=["How quickly can I hire a virtual assistant through your platform?","Do your virtual assistants work in US time zones?","What makes Dedicated VA one of the best virtual assistant services?","Is my company data secure?","Lorem ipsum dolor sit amet, consectetur adipiscing elit.","Lorem ipsum dolor sit amet, consectetur adipiscing elit."];
const faqRoot=document.getElementById('faq-list');
faqQuestions.forEach((question,i)=>{
 const item=document.createElement('div');item.className='accordion-item faq-item';
 item.innerHTML='<h3 class="accordion-header"><button class="faq-button'+(i===2?'':' collapsed')+'" type="button" data-bs-toggle="collapse" data-bs-target="#faq-answer-'+i+'" aria-expanded="'+(i===2)+'" aria-controls="faq-answer-'+i+'" id="faq-question-'+i+'"><span class="faq-icon"><img src="assets/imgSvg3.svg" alt=""></span><span>'+question+'</span><span class="faq-toggle"><img src="assets/imgSvg4.svg" alt=""></span></button></h3><div id="faq-answer-'+i+'" class="accordion-collapse collapse'+(i===2?' show':'')+'" data-bs-parent="#faq-list" aria-labelledby="faq-question-'+i+'"><div class="faq-answer">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lobortis justo ac mauris consequat, ac blandit ante commodo. Our team will help you find the right support for your business and answer any questions along the way.</div></div>';
 faqRoot.append(item);
});
const activities=[
 {icon:'imgRectangle10246.png',badge:'imgRectangle10247.png',text:'Cleared 142 support tickets, archived spam, and drafted responses for 3 priority VIP client emails.',label:'INBOX ZERO ACHIEVED'},
 {icon:'report-icon.png',badge:'report-badge.png',text:'Weekly report is ready. I pulled the numbers, cleaned things up, and shared the file in the folder.',label:'SHARED IN GOOGLE DRIVE'},
 {icon:'calendar-icon.png',badge:'calendar-badge.png',text:'All investor meetings for next week have been rescheduled and confirmed according to your new timezone preference.',label:'CALENDAR UPDATED'}
];
const stack=document.querySelector('.activity-stack'), cardsRoot=document.getElementById('activity-cards');
activities.forEach((activity,i)=>{
 const article=document.createElement('article');article.className='activity-card'+(i===0?' is-active':'');article.setAttribute('aria-hidden',String(i!==0));
 article.innerHTML='<div class="activity-front"><span class="activity-icon"><img src="assets/'+activity.icon+'" alt=""></span><p>'+activity.text+'</p></div><div class="activity-pill"><img src="assets/'+activity.badge+'" alt=""><span>'+activity.label+'</span></div>';
 cardsRoot.append(article);
});
const activityCards=[...cardsRoot.children];let active=0, timer=null, leavingTimer=null;
function stopCycle(){clearInterval(timer);timer=null;}
function startCycle(){
 stopCycle();if(motion.matches||document.hidden||stack.matches(':hover')||stack.contains(document.activeElement))return;
 timer=setInterval(()=>{
  const previous=activityCards[active];previous.classList.remove('is-active');previous.classList.add('is-leaving');previous.setAttribute('aria-hidden','true');
  active=(active+1)%activityCards.length;const next=activityCards[active];next.classList.add('is-active');next.setAttribute('aria-hidden','false');
  clearTimeout(leavingTimer);leavingTimer=setTimeout(()=>previous.classList.remove('is-leaving'),600);
 },4000);
}
stack.addEventListener('mouseenter',stopCycle);stack.addEventListener('mouseleave',startCycle);
stack.addEventListener('focusin',stopCycle);stack.addEventListener('focusout',()=>setTimeout(startCycle,0));
document.addEventListener('visibilitychange',startCycle);motion.addEventListener('change',startCycle);startCycle();
const viewport=document.getElementById('process-viewport'), prev=document.getElementById('process-prev'), next=document.getElementById('process-next');
function syncArrows(){const max=Math.max(0,viewport.scrollWidth-viewport.clientWidth);prev.disabled=viewport.scrollLeft<=1;next.disabled=viewport.scrollLeft>=max-1;}
function move(direction){
 const max=viewport.scrollWidth-viewport.clientWidth;
 const cardWidth=viewport.querySelector('.process-card').getBoundingClientRect().width;
 const distance=window.innerWidth>=992 ? max : cardWidth+20;
 viewport.scrollTo({left:Math.max(0,Math.min(max,viewport.scrollLeft+direction*distance)),behavior:motion.matches?'instant':'smooth'});
}
prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
viewport.addEventListener('scroll',syncArrows,{passive:true});
viewport.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowLeft'?-1:1);}});
const observer=new ResizeObserver(syncArrows);observer.observe(viewport);syncArrows();
function sizeArtwork(){document.documentElement.style.setProperty('--art-scale',Math.min(1,window.innerWidth/1600));}
window.addEventListener('resize',sizeArtwork);sizeArtwork();
document.querySelector('.touch-button').addEventListener('click',event=>{
 event.preventDefault();document.getElementById('hero').scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});
});
const modal=document.getElementById('support-modal');
const page=document.getElementById('page-content');
modal.addEventListener('shown.bs.modal',()=>{page.inert=true;modal.querySelector('input')?.focus();});
modal.addEventListener('hidden.bs.modal',()=>{page.inert=false;document.querySelector('.support-trigger').focus();});
})();

document.querySelector('.header-touch-button').addEventListener('click', event => {
  event.preventDefault();
  const form = document.getElementById('hero-form-host');
  form.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'center'
  });
  form.querySelector('input').focus({ preventScroll: true });
});
