"use strict";

// Set this to your consultation API URL when the form backend is available.
const CONSULTATION_ENDPOINT = "";
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const asset = (name, alt = "", attrs = "") =>
  `<img src="assets/${name}.webp" alt="${escapeHtml(alt)}" loading="lazy" ${attrs}>`;

function logoStrip(id, prefix, names, className) {
  const group = names
    .map((name, i) => asset(`${prefix}-${i}`, name, `class="${className}"`))
    .join("");
  $(id).innerHTML =
    `<div class="logo-group">${group}</div><div class="logo-group" aria-hidden="true">${group.replace(/alt="[^"]*"/g, 'alt=""')}</div>`;
}
logoStrip(
  "#partner-logos",
  "partner",
  [
    "Magento",
    "AWS",
    "Microsoft Azure",
    "Google Cloud",
    "Industry partner",
    "Adobe",
    "MuleSoft",
    "Databricks",
    "Salesforce",
    "HubSpot",
  ],
  "partner-logo",
);
logoStrip(
  "#technology-logos",
  "technology",
  [
    "React",
    "Next.js",
    "Tailwind CSS",
    "Python",
    "Express.js",
    "Node.js",
    "TensorFlow",
    "Keras",
    "FastAPI",
    "Technology framework",
    "Technology framework",
    "Technology framework",
  ],
  "technology-logo",
);
$("#compliance-logos").innerHTML = ["PCI DSS", "ISO", "HIPAA", "GDPR"]
  .map((name, i) => asset(`compliance-${i}`, name))
  .join("");

const conversations = [
  {
    category: "HANDOFF",
    name: "Human Handoff",
    channel: "Web App",
    intent: "billing_dispute",
    confidence: "0.65",
    source: "Escalation rules",
    action: "Agent notified",
    messages: [
      ["user", "I was charged twice. I need to speak to a person."],
      [
        "assistant",
        "Sorry about that. I’m connecting you with a billing specialist now.",
      ],
      [
        "assistant",
        "I’ve shared your account details and this conversation, so you won’t need to repeat anything.",
      ],
    ],
  },
  {
    category: "SUPPORT",
    name: "Customer Support",
    channel: "Website chat",
    intent: "order_status",
    confidence: "0.92",
    source: "Order system",
    action: "Ticket updated",
    messages: [
      ["user", "My order hasn’t arrived yet."],
      [
        "assistant",
        "I can check that for you. Could you share your order number?",
      ],
      ["user", "It’s A-10482."],
      [
        "assistant",
        "It’s out for delivery today. I’ve added a note to your support ticket.",
      ],
    ],
  },
  {
    category: "LEADS",
    name: "Lead Qualification",
    channel: "Website chat",
    intent: "new_project",
    confidence: "0.92",
    source: "Qualification flow",
    action: "Lead sent to CRM",
    messages: [
      ["assistant", "Hi! What are you looking to build?"],
      ["user", "A support chatbot for our website."],
      ["assistant", "Great. Which systems should it connect to?"],
      ["user", "Our CRM and helpdesk."],
      ["assistant", "Thanks. I’ll pass this to our team with your details."],
    ],
  },
  {
    category: "HELPDESK",
    name: "Employee Helpdesk",
    channel: "Employee portal",
    intent: "hr_policy",
    confidence: "0.92",
    source: "HR policy / Remote work",
    action: "Portal link shared",
    messages: [
      ["user", "How do I request remote work?"],
      [
        "assistant",
        "Submit a request in the HR portal at least five working days ahead. Your manager approves it there.",
      ],
      ["user", "Can I attach a schedule?"],
      [
        "assistant",
        "Yes, the form accepts a weekly schedule. Here’s the link.",
      ],
    ],
  },
];
let chatIndex = 0;
let chatPaused = false;
let chatTimer;
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
$("#chat-dots").innerHTML = conversations
  .map(
    (chat, i) =>
      `<button aria-label="Show ${chat.name} example" data-chat="${i}" aria-current="${i === 0}"></button>`,
  )
  .join("");
function showChat(index) {
  chatIndex = index;
  const chat = conversations[index];
  $("#chat-category").textContent = chat.category;
  $$("#chat-dots button").forEach((button, i) =>
    button.setAttribute("aria-current", String(i === index)),
  );
  $("#chat-stage").innerHTML =
    `<div class="chat-content"><div class="chat-window"><div class="chat-heading"><span class="assistant-icon">${asset("assistant")}</span><span>AI Assistant<small>${chat.name}</small></span></div><div class="messages">${chat.messages.map(([role, message], i) => `<div class="message ${role}" style="--i:${i}">${escapeHtml(message)}</div>`).join("")}</div><div class="message-input" aria-hidden="true"><span>Type a message</span><span>→</span></div></div><aside class="signals" aria-label="Conversation signals"><div class="signals-heading">Conversation Signals</div><dl><dt>Channel</dt><dd>${chat.channel}</dd><dt>Language</dt><dd>English</dd><dt>Intent</dt><dd><span class="intent">${chat.intent}</span></dd><dt class="confidence-label">Confidence <span>${chat.confidence}</span></dt><dd><div class="confidence"><span style="width:${Number(chat.confidence) * 100}%"></span></div></dd><dt>Source</dt><dd>${chat.source}</dd><dt>Action</dt><dd class="action">${chat.action}</dd></dl></aside></div>`;
}
function restartChat() {
  clearInterval(chatTimer);
  if (!chatPaused && !motionPreference.matches && !document.hidden)
    chatTimer = setInterval(
      () => showChat((chatIndex + 1) % conversations.length),
      7000,
    );
}
$("#chat-dots").addEventListener("click", (event) => {
  const button = event.target.closest("[data-chat]");
  if (button) {
    showChat(Number(button.dataset.chat));
    restartChat();
  }
});
$("#chat-pause").addEventListener("click", () => {
  chatPaused = !chatPaused;
  $("#chat-pause").textContent = chatPaused ? "▶" : "Ⅱ";
  $("#chat-pause").setAttribute(
    "aria-label",
    `${chatPaused ? "Resume" : "Pause"} conversation carousel`,
  );
  restartChat();
});
$(".chat-carousel").addEventListener("mouseenter", () =>
  clearInterval(chatTimer),
);
$(".chat-carousel").addEventListener("mouseleave", restartChat);
$(".chat-carousel").addEventListener("focusin", () => clearInterval(chatTimer));
$(".chat-carousel").addEventListener("focusout", (event) => {
  if (!$(".chat-carousel").contains(event.relatedTarget)) restartChat();
});
document.addEventListener("visibilitychange", restartChat);
motionPreference.addEventListener("change", restartChat);
showChat(0);
restartChat();

const industryNames = [
  "E-Commerce & Retail",
  "Healthcare & Telemedicine",
  "Banking",
  "Education and EdTech",
  "Real Estate",
  "Manufacturing and Indstry",
  "Automotive and Mobility",
];
const industryAlts = [
  "Shopping chatbot showing running shoes",
  "Healthcare chatbot appointment booking",
  "Banking chatbot helping freeze a card",
  "Education chatbot showing a course plan",
  "Real estate chatbot booking a viewing",
  "Manufacturing chatbot requesting a product quote",
  "Automotive chatbot confirming a service booking",
];
const industryDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum sem id elit maximus, sed tempor turpis ornare. Cras consectetur tincidunt elit dignissim feugiat.";
$("#industry-list").innerHTML = industryNames
  .map(
    (name, i) =>
      `<div class="industry-item"><button class="industry-trigger" id="industry-trigger-${i}" aria-expanded="${i === 1}" aria-controls="industry-detail-${i}" data-industry="${i}">${name}<span class="round-toggle" aria-hidden="true">${i === 1 ? "−" : "+"}</span></button><p id="industry-detail-${i}" class="industry-detail" aria-labelledby="industry-trigger-${i}" ${i === 1 ? "" : "hidden"}>${industryDescription}</p></div>`,
  )
  .join("");
$("#industry-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-industry]");
  if (!button) return;
  const selected = Number(button.dataset.industry);
  $$("[data-industry]").forEach((trigger, i) => {
    trigger.setAttribute("aria-expanded", String(i === selected));
    $(".round-toggle", trigger).textContent = i === selected ? "−" : "+";
    $(`#industry-detail-${i}`).hidden = i !== selected;
  });
  $("#industry-image").src = `assets/industry-${selected}.webp`;
  $("#industry-image").alt = industryAlts[selected];
});

const capabilityNames = [
  "Conversational AI",
  "Integration & Automation",
  "Security & Performance",
  "AI Models & Technology",
];
const modelNames = [
  "Large Language Models (LLMs)",
  "Instruction - Tuned Models",
  "Transformer - Based Models",
  "Multimodal AI Models",
];
$("#capability-tabs").innerHTML = capabilityNames
  .map(
    (name, i) =>
      `<button id="capability-${i}" role="tab" aria-selected="${i === 0}" aria-controls="capability-panel" tabindex="${i === 0 ? 0 : -1}" data-capability="${i}">${name}</button>`,
  )
  .join("");
function showCapability(index) {
  $$("[data-capability]").forEach((button, i) => {
    button.setAttribute("aria-selected", String(index === i));
    button.tabIndex = index === i ? 0 : -1;
  });
  $("#capability-panel").setAttribute("aria-labelledby", `capability-${index}`);
  if (index < 3) {
    $("#capability-panel").innerHTML =
      `<div class="feature-grid">${designContent.features[index].map((item, i) => `<article class="feature-card"><div class="feature-title"><span class="feature-icon">${asset(`feature-${index * 6 + i}`)}</span><h3>${escapeHtml(item.title)}</h3></div><p>${escapeHtml(item.body)}</p></article>`).join("")}</div>`;
  } else {
    $("#capability-panel").innerHTML =
      `<div class="models-layout"><div class="model-tabs" role="tablist" aria-label="AI model categories" aria-orientation="vertical">${modelNames.map((name, i) => `<button role="tab" id="model-${i}" aria-selected="${i === 0}" aria-controls="model-panel" tabindex="${i === 0 ? 0 : -1}" data-model="${i}">${name}</button>`).join("")}</div><div class="model-picture accent-border" id="model-panel" role="tabpanel" aria-labelledby="model-0">${asset("models-0", "Large language model technology logos", 'width="927" height="388"')}</div></div>`;
  }
}
$("#capability-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-capability]");
  if (button) showCapability(Number(button.dataset.capability));
});
$("#capability-panel").addEventListener("click", (event) => {
  const button = event.target.closest("[data-model]");
  if (!button) return;
  const selected = Number(button.dataset.model);
  $$("[data-model]").forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === selected));
    tab.tabIndex = i === selected ? 0 : -1;
  });
  $("#model-panel").setAttribute("aria-labelledby", `model-${selected}`);
  $("#model-panel").innerHTML = asset(
    `models-${selected}`,
    `${modelNames[selected]} technology logos`,
    'width="927" height="388"',
  );
});
document.addEventListener("keydown", (event) => {
  const tab = event.target.closest('[role="tab"]');
  if (!tab) return;
  const list = tab.closest('[role="tablist"]');
  const tabs = $$('[role="tab"]', list);
  let next = tabs.indexOf(tab);
  const vertical = list.getAttribute("aria-orientation") === "vertical";
  if (event.key === (vertical ? "ArrowDown" : "ArrowRight"))
    next = (next + 1) % tabs.length;
  else if (event.key === (vertical ? "ArrowUp" : "ArrowLeft"))
    next = (next - 1 + tabs.length) % tabs.length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = tabs.length - 1;
  else return;
  event.preventDefault();
  tabs[next].click();
  tabs[next].focus();
});

// The PDF supplies the second answer. The remaining answers are editable draft copy.
const faqs = [
  [
    "Can your chatbot do more than answer customer questions?",
    "Yes. Chatbots can qualify leads, automate bookings, update records, and support business workflows through integrations with your existing systems.",
  ],
  [
    "What happens when a customer asks something the chatbot cannot handle?",
    "The chatbot can be configured to recognize requests that fall outside its knowledge, permissions or defined workflows. Instead of forcing an unreliable answer, it can guide the customer toward the appropriate next step or hand the conversation to a human team member with the relevant context.",
  ],
  [
    "Can you connect our chatbot to the systems we already use?",
    "We can connect your chatbot with CRM platforms, helpdesks, knowledge bases, and other business applications through available APIs and integrations.",
  ],
  [
    "Can our chatbot respond using our own business knowledge?",
    "Your chatbot can use approved documents, FAQs, databases, and internal knowledge sources to provide answers relevant to your business.",
  ],
  [
    "What if we already have a chatbot but it isn't delivering enough value?",
    "We can review your existing chatbot, identify gaps in its conversations and integrations, and improve its responses, workflows, and performance.",
  ],
];
$("#faq-list").innerHTML = faqs
  .map(
    ([question, answer], i) =>
      `<details class="faq-item" name="faq" ${i === 1 ? "open" : ""}><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`,
  )
  .join("");

function formMarkup(prefix) {
  return `<form class="consultation-form" id="${prefix}-consultation"><div class="form-grid"><label for="${prefix}-name">Full Name *<input id="${prefix}-name" name="name" autocomplete="name" placeholder="e.g. Dr. Thomas Müller" required maxlength="150"></label><label for="${prefix}-company">Company Name<input id="${prefix}-company" name="company" autocomplete="organization" placeholder="e.g. Müller & Söhne GmbH" maxlength="150"></label><label for="${prefix}-email">Corporate Email *<input id="${prefix}-email" name="email" autocomplete="email" type="email" placeholder="e.g. t.mueller@company.de" required maxlength="254"></label><label for="${prefix}-phone">Phone Number *<input id="${prefix}-phone" name="phone" type="tel" autocomplete="tel" placeholder="e.g. +49 9122 982110" required maxlength="40"></label><label class="full-width" for="${prefix}-message">How can we assist you?<textarea id="${prefix}-message" name="message" placeholder="Describe" rows="3" maxlength="5000"></textarea></label></div><label class="consent" for="${prefix}-consent"><input id="${prefix}-consent" type="checkbox" name="consent" required><span>I acknowledge that my contact data is handled strictly in accordance with GDPR principles by the operators of BES Systemhaus GmbH for processing this consultation request. *</span></label><button class="button" type="submit">Book Your Chatbot Consultation</button><p class="form-status" role="status" hidden></p></form>`;
}
$("#inline-form").innerHTML = formMarkup("inline");
$("#modal-form").innerHTML = formMarkup("modal");
const dialog = $("#consultation-dialog");
let dialogTrigger;
function openConsultation(trigger) {
  dialogTrigger = trigger;
  dialog.showModal();
  document.body.classList.add("modal-open");
  $("#modal-name").focus();
}
$$("[data-consult]").forEach((button) =>
  button.addEventListener("click", () => openConsultation(button)),
);
$(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  dialogTrigger?.focus();
});
$("#hero-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  $("#modal-name").value = data.get("name");
  $("#modal-email").value = data.get("email");
  openConsultation($("button", event.currentTarget));
});
$$(".consultation-form").forEach((form) =>
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = $(".form-status", form);
    status.hidden = false;
    if (!CONSULTATION_ENDPOINT) {
      status.textContent =
        "Online requests are not available yet. Please use “Book a 30-minute strategy call” to schedule your consultation. Your information has not been sent.";
      return;
    }
    const button = $('button[type="submit"]', form);
    button.disabled = true;
    button.textContent = "Sending…";
    status.textContent = "";
    try {
      const response = await fetch(CONSULTATION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error("Request failed");
      status.textContent =
        "Thank you. Your consultation request has been sent.";
      form.reset();
    } catch {
      status.textContent =
        "Your request could not be sent. Please try again or book a strategy call.";
    } finally {
      button.disabled = false;
      button.textContent = "Book Your Chatbot Consultation";
    }
  }),
);

// Design content is embedded below so this page also works when opened directly.
const designContent = {
  solutions: [
    {
      title: "Conversational AI & Voice Assistants",
      body: "Build intuitive chat and voice experiences that let customers interact naturally across websites, mobile apps, kiosks, and connected devices.",
    },
    {
      title: "Multilingual Chatbots & Conversation Design",
      body: "Design context-aware conversations that support multiple languages, maintain a consistent tone, and help businesses serve customers across global markets.",
    },
    {
      title: "Chatbot Consulting, Training & Maintenance",
      body: "From solution planning and architecture to real-world retraining, feedback analysis, version updates, we keep your chatbot accurate, secure, reliable.",
    },
    {
      title: "Lead Generation & Customer Support Bots",
      body: "Engage website visitors, qualify potential customers, route promising leads to sales teams, resolve routine customer queries with human handoff when needed.",
    },
    {
      title: "Transactional Chatbots & System Integration",
      body: "Connect chatbots with business systems to automate bookings, payments, renewals, order updates, other repetitive processes with less manual effort.",
    },
    {
      title: "Enterprise Chatbot Architecture & Development",
      body: "Develop secure, scalable custom chatbots for HR queries, finance approvals, IT support, and internal workflows, designed around your business requirements.",
    },
  ],
  features: [
    [
      {
        title: "Natural Language Understanding (NLU)",
        body: "Understand user intent, extract key information, and interpret natural language to deliver relevant, accurate responses.",
      },
      {
        title: "Sentiment Analysis",
        body: "Recognize emotional tone and user sentiment to adapt responses, improve interactions, and identify conversations that need human assistance.",
      },
      {
        title: "Multi-Step Dialogue & Context Retention",
        body: "Maintain conversation context across multiple exchanges, remember relevant details, and help users complete complex tasks without repeating information.",
      },
      {
        title: "Personalized User Journeys",
        body: "Tailor responses, recommendations, and conversation flows to user preferences, previous interactions, and specific business needs.",
      },
      {
        title: "Voice & Multilingual Interaction",
        body: "Enable natural spoken conversations and multilingual communication across websites, mobile apps, and connected devices.",
      },
      {
        title: "Adaptive Learning & Response Optimization",
        body: "Refine chatbot responses using conversation data, user feedback, and performance evaluations to improve relevance and accuracy over time.",
      },
    ],
    [
      {
        title: "CRM & API Integration",
        body: "Connect chatbots with CRM platforms, external APIs, and business applications to synchronize customer information and streamline workflows.",
      },
      {
        title: "Payment & Transaction Automation",
        body: "Automate bookings, payment processing, subscription renewals, and order updates through connected chatbot experiences.",
      },
      {
        title: "Real-Time Analytics & Reporting",
        body: "Monitor conversations, user engagement, and chatbot performance to identify trends and make informed business decisions.",
      },
      {
        title: "Knowledge Base & Data Retrieval",
        body: "Connect chatbots to internal documents, FAQs, databases, and knowledge repositories to provide relevant, information-based answers.",
      },
      {
        title: "Custom Workflow Automation",
        body: "Build tailored workflows that trigger actions, route requests, update records, and coordinate tasks across business processes.",
      },
      {
        title: "Omnichannel Integration",
        body: "Deploy consistent chatbot experiences across websites, mobile applications, and messaging platforms, helping users switch channels with less friction.",
      },
    ],
    [
      {
        title: "Data Protection & Privacy",
        body: "Safeguard sensitive information with appropriate encryption, access controls, and data-handling practices designed to support your security requirements.",
      },
      {
        title: "Low-Latency Response Performance",
        body: "Optimize chatbot response times to deliver faster interactions, reduce user waiting, and maintain a smooth conversational experience.",
      },
      {
        title: "Scalable Infrastructure",
        body: "Design chatbot infrastructure to handle growing user demand, increasing conversation volumes, and evolving business requirements.",
      },
      {
        title: "Continuous Monitoring & Optimization",
        body: "Track chatbot performance, identify response issues, and use testing and feedback to improve reliability and answer quality over time.",
      },
      {
        title: "Authentication & Access Control",
        body: "Help protect sensitive workflows with identity verification, role-based permissions, and controlled access to business information.",
      },
      {
        title: "Accessibility & Inclusive Experiences",
        body: "Design chatbot interfaces that support diverse user needs, including keyboard navigation, assistive technologies, and accessible interaction patterns.",
      },
    ],
  ],
};
$("#solutions-grid").innerHTML = designContent.solutions
  .map(
    (item, i) =>
      `<article class="solution-card"><div class="solution-visual">${asset(`solution-${i}`, item.title)}</div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`,
  )
  .join("");
showCapability(0);
