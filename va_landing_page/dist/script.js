'use strict';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const modal = document.querySelector('#consultation-modal');
const template = document.querySelector('#trial-form-template');
let modalOpener;

// Both versions share one template, but have separate labels, values and validation.
document.querySelectorAll('[data-form-slot]').forEach(slot => {
  slot.append(template.content.cloneNode(true));
  const prefix = slot.dataset.formSlot;
  slot.querySelector('h2').id = `${prefix}-title`;
  slot.querySelectorAll('input, textarea').forEach((input, index) => {
    input.id = `${prefix}-${input.name}-${index}`;
    input.closest('label').htmlFor = input.id;
  });
  slot.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const status = event.currentTarget.querySelector('.form-status');
    status.hidden = false;
    status.textContent = 'Demo complete — your form is valid. No information has been sent or saved.';
  });
});

function openModal(opener, values = {}) {
  modalOpener = opener;
  const form = modal.querySelector('form');
  form.querySelector('.form-status').hidden = true;
  ['name', 'email'].forEach(key => {
    if (values[key] !== undefined) form.elements[key].value = values[key];
  });
  if (values.plan) form.elements.plan.value = values.plan;
  document.body.classList.add('modal-open');
  modal.showModal();
  modal.scrollTop = 0;
  form.elements.name.focus({ preventScroll: true });
}
document.querySelectorAll('[data-open-modal]').forEach(button => {
  button.addEventListener('click', () => openModal(button, { plan: button.dataset.plan }));
});
document.querySelector('#hero-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  openModal(form.querySelector('button'), { name: form.elements.name.value, email: form.elements.email.value });
});
modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
let backdropDown = false;
modal.addEventListener('pointerdown', event => { backdropDown = event.target === modal && outsideDialog(event); });
modal.addEventListener('click', event => {
  if (backdropDown && event.target === modal && outsideDialog(event)) modal.close();
  backdropDown = false;
});
function outsideDialog(event) {
  const rect = modal.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
}
modal.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  modalOpener?.focus({ preventScroll: true });
});
modal.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [...modal.querySelectorAll('button, input, textarea, a[href]')].filter(el => !el.disabled);
  const first = focusable[0], last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

function wireAccordion(container, imageTarget) {
  const triggers = [...container.querySelectorAll('.accordion-trigger')];
  triggers.forEach(trigger => trigger.addEventListener('click', () => {
    const wasOpen = trigger.getAttribute('aria-expanded') === 'true';
    triggers.forEach(button => {
      const open = button === trigger && (imageTarget || !wasOpen);
      button.setAttribute('aria-expanded', String(Boolean(open)));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
    });
    if (imageTarget) {
      imageTarget.src = trigger.dataset.costImage;
      imageTarget.alt = trigger.dataset.costAlt;
    }
  }));
}
wireAccordion(document.querySelector('.faq-list'));
wireAccordion(document.querySelector('.comparison-accordion'), document.querySelector('#cost-image'));

// Three identical sets let native scrolling wrap without a visible reset.
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const cards = [...track.children];
  const copySet = () => cards.map(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  });
  track.prepend(...copySet());
  track.append(...copySet());
  let cycleWidth = 0;
  let pointerDown = false, hovering = false, lastTime = 0, remainder = 0;
  function measure() {
    const previousWidth = cycleWidth;
    cycleWidth = cards[0].offsetLeft - track.firstElementChild.offsetLeft;
    if (!cycleWidth) return;
    const phase = previousWidth ? ((track.scrollLeft % previousWidth) + previousWidth) % previousWidth / previousWidth : 0;
    track.scrollLeft = cycleWidth * (1 + phase);
  }
  function wrap() {
    if (!cycleWidth) return;
    if (track.scrollLeft < cycleWidth / 2) track.scrollLeft += cycleWidth;
    else if (track.scrollLeft >= cycleWidth * 1.5) track.scrollLeft -= cycleWidth;
  }
  function move(direction) {
    const step = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
    wrap();
    track.scrollBy({ left: step * direction, behavior: 'instant' });
  }
  carousel.querySelector('[data-prev]').addEventListener('click', () => move(-1));
  carousel.querySelector('[data-next]').addEventListener('click', () => move(1));
  // Include the cloned cards; headings, gaps and controls do not pause the row.
  [...track.children].forEach(card => {
    card.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') hovering = true;
    });
    card.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse') hovering = false;
    });
  });
  // Let native touch swipes finish without a competing automatic scroll.
  track.addEventListener('pointerdown', event => { pointerDown = event.pointerType === 'touch'; });
  const release = () => { pointerDown = false; };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  function animate(time) {
    const elapsed = lastTime ? Math.min(time - lastTime, 50) : 0;
    lastTime = time;
    if (!pointerDown) wrap();
    if (!reducedMotion.matches && !document.hidden && !modal.open && !hovering && !pointerDown) {
      remainder += elapsed * 0.035; // 35 pixels per second, independent of refresh rate.
      const distance = Math.floor(remainder);
      if (distance) { track.scrollLeft += distance; remainder -= distance; }
    }
    requestAnimationFrame(animate);
  }
  new ResizeObserver(measure).observe(track);
  measure();
  requestAnimationFrame(animate);
});

const notificationArea = document.querySelector('.notification-area');
const notifications = [...notificationArea.querySelectorAll('.notification')];
let activeNotification = 0;
function showNotification(index) {
  activeNotification = index % notifications.length;
  notifications.forEach((card, i) => {
    card.classList.toggle('is-active', i === activeNotification);
    card.setAttribute('aria-hidden', String(i !== activeNotification));
  });
}
showNotification(0);
setInterval(() => {
  if (!reducedMotion.matches && !document.hidden && !modal.open && !notificationArea.matches(':hover, :focus-within')) showNotification(activeNotification + 1);
}, 1000);
