from pathlib import Path
import re, json, html
root=Path(__file__).resolve().parent.parent
s=(root/'.design/reference.jsx').read_text(encoding='utf-8')
assets=json.loads((root/'.design/assets.json').read_text())
def txt(n,source=s):
    m=re.search(r'data-node-id="22:'+str(n)+r'"[^>]*>(.*?)</p>',source,re.S)
    if not m: raise ValueError(n)
    t=re.sub(r'<[^>]+>','',m.group(1)).replace('{`','').replace('`}','')
    return html.escape(' '.join(html.unescape(t).split()))
def img(key,alt='',cls='',extra=''):
    return f'<img src="{assets[key]}" alt="{alt}" class="{cls}" {extra}>'
def btn(label,attrs='',cls='button'):
    if cls == 'contact-link' and 'Book a' in label:
        return f'<a class="contact-link" href="https://dedicatedva.com/schedule-a-discussion/">{label}</a>'
    return f'<button type="button" class="{cls}" {attrs}>{label}</button>'
def heading(title,desc='',cls=''):
    return f'<header class="section-heading {cls}"><h2>{title}</h2>'+ (f'<p>{desc}</p>' if desc else '')+'</header>'
def arrows(label):
    return '<div class="carousel-controls">'+btn('←',f'data-prev aria-label="Previous {label}"','arrow')+btn('→',f'data-next aria-label="Next {label}"','arrow')+'</div>'
out=['''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Dedicated virtual assistants for a flat $999/month or $13/hour. Explore our services, meet the team, and try a risk-free trial."><title>DedicatedVA — Your dedicated support team</title><link rel="stylesheet" href="styles.css"><script src="script.js" defer></script></head><body><a class="skip-link" href="#main">Skip to content</a><main id="main">''']
out += [f'''<section class="hero blue" aria-labelledby="hero-title"><div class="container"><nav class="nav" aria-label="Main navigation"><a href="#" aria-label="DedicatedVA home">{img('imgLogo','DedicatedVA','brand', 'width="188" height="40"')}</a><a class="phone" href="tel:0123456789">0123 456 789</a></nav><div class="hero-grid"><div><h1 id="hero-title"><span>Hire a Top-Tier</span> <span>Virtual Assistant.</span> <span>Zero Hidden Fees.</span></h1><p class="hero-description">{txt(553)}</p><form id="hero-form" class="hero-form"><div class="field-row"><label>Name<input name="name" autocomplete="name" placeholder="Your Name" required></label><label>Work email<input name="email" type="email" autocomplete="email" placeholder="you@yourcompany.com" required></label></div><button class="button" type="submit">Start Your Risk-Free Trial</button></form></div><div class="hero-visual">{img('imgRectangle10274','Virtual assistant ready to support your team','', 'fetchpriority="high"')}</div></div></div></section>''']
logos=['imgImage12','imgImage17','imgImage18','imgImage15','imgImage16','imgImage13','imgImage14','imgLogoImage8','imgLogoImage9']
logo_sizes=[(110,62),(110,52),(115,57),(115,57),(119,52),(116,55),(121,60),(132,66),(132,66)]
logo_group=''.join(img(k,'Trusted business logo','',f'width="{w}" height="{h}" loading="lazy"') for k,(w,h) in zip(logos,logo_sizes))
out += [f'<section class="trusted container" aria-label="Trusted businesses"><p>{txt(74)}</p><div class="logo-marquee" tabindex="0" aria-label="Trusted business logos; focus to pause"><div class="logo-track"><div class="logo-group">{logo_group}</div><div class="logo-group" aria-hidden="true">{logo_group}</div></div></div></section>']
services=''
for i,(title,desc) in enumerate([(38,39),(44,45),(50,51),(57,58),(69,70),(63,64)],1):
    services+=f'<article class="service-card service-{i}" tabindex="0"><div class="service-image">{img("imgImage"+str([1,2,3,4,6,5][i-1]),txt(title)+" illustration","", "loading=\"lazy\"")}</div><h3>{txt(title)}</h3><p>{txt(desc)}</p></article>'
out += [f'<section class="services section" id="services"><div class="container">{heading("What Can You <span class=\"gradient-text\">Outsource Today?</span>",txt(31))}<div class="service-grid">{services}</div><div class="center">{btn("Let’s Build Your Support Team","data-open-modal")}</div></div></section>']
notifications=[]
for prefix,title,body,icon,badge in [('',txt(25),txt(22),'imgRectangle10246','imgRectangle10247'),('22-578-', 'SHARED IN GOOGLE DRIVE','Weekly report is ready. I pulled the numbers, cleaned things up, and shared the file in the folder.','imgRectangle10246','imgRectangle10247'),('22-590-','CALENDAR UPDATED','All investor meetings for next week have been rescheduled and confirmed according to your new timezone preference.','imgRectangle10246','imgRectangle10247')]:
    notifications.append(f'<article class="notification" aria-hidden="true"><div class="notification-badge">{img(prefix+badge)}<span>{title}</span></div><div class="notification-body"><div class="notification-icon">{img(prefix+icon)}</div><p>{body}</p></div></article>')
out += [f'<section class="partner section blue"><div class="container partner-grid"><div><h2><span>Why Partner With a Top-Tier</span> <span>Virtual Assistant Agency?</span></h2><p>{txt(13)}</p></div><div class="notification-area" aria-label="Recent assistant achievements"><div class="notification-stack">{"".join(notifications)}</div></div></div></section>']
team=[]
for start,end,nameid in [(334,354,345),(434,454,445),(354,374,365),(374,394,385),(394,414,405),(414,434,425)]:
    chunk=s[s.index(f'data-node-id="22:{start}"'):s.index(f'data-node-id="22:{end}"')]
    keys=re.findall(r'src=\{(\w+)\}',chunk)
    portrait=keys[1]; flag=keys[2]; icons=keys[3:]
    tag=re.search(r'<img[^>]+src=\{'+portrait+r'\}[^>]*>',chunk).group()
    classes=re.search(r'className="([^"]+)"',tag).group(1)
    style=''
    for prop,pattern in [('width',r'w-\[([\d.]+%)\]'),('height',r'h-\[([\d.]+%)\]'),('left',r'left-\[(-?[\d.]+%)\]')]:
        m=re.search(pattern,classes)
        if m:style+=prop+':'+m.group(1)+';'
    team.append(f'<article class="team-card"><div class="team-art">{img(keys[0],"","team-backdrop") }<div class="portrait">{img(portrait,txt(nameid),"",f"style=\"{style}\" loading=\"lazy\"")}</div></div><div class="team-info"><div class="team-person"><div><h3>{txt(nameid)}</h3><p>{txt(nameid+1)}</p></div>{img(flag,"Location flag","flag")}</div><div class="tool-icons">'+''.join(img(k,'Work tool','', 'loading="lazy"') for k in icons)+'</div></div></article>')
out += [f'<section class="team section carousel" aria-label="Meet the team">{heading("Meet the People <span class=\"gradient-text\">Who’ll Have Your Back</span>",txt(332),"container")}<div class="carousel-track team-track" tabindex="0">{"".join(team)}</div>{arrows("team cards")}</section>']
comparison=''
for i,(title,body,asset) in enumerate([(157,159,'22-602-imgRectangle19'),(164,166,'imgRectangle18'),(171,173,'22-603-imgRectangle20')]):
    comparison+=f'<div class="comparison-item"><h3><button class="accordion-trigger" aria-expanded="{str(i==1).lower()}" aria-controls="cost-panel-{i}" data-cost-image="{assets[asset]}" data-cost-alt="{txt(title)}">{txt(title)}<span class="toggle-icon" aria-hidden="true"></span></button></h3><div class="accordion-panel" id="cost-panel-{i}" {"hidden" if i!=1 else ""}><p>{txt(body)}</p></div></div>'
out += [f'<section class="comparison section blue" id="value"><div class="container">{heading(txt(149),txt(150))}<div class="comparison-grid"><div class="comparison-accordion">{comparison}</div>{img("imgRectangle18","Dedicated talent for your business","comparison-image", "id=\"cost-image\" loading=\"lazy\"")}</div></div></section>']
out += [f'<section class="security section container">{heading("Enterprise <span class=\"gradient-text\">Security</span> at Small-Business Rates",txt(178))}<div class="security-logos">'+''.join(img(k,alt,'',f'width="{w}" height="{h}" loading="lazy"') for k,alt,w,h in [('img96A2C438Dce1Bbb51Fd34994B081B6B31','GDPR',150,57),('imgImage25','ISO',110,104),('imgImage26','Security certification',150,89),('imgImgImage25','Security badge',81,104)])+'</div></section>']
reviews=''
for body,name,location,avatar in [(94,99,100,'imgFrame2147223836'),(103,108,109,'imgFrame2147223837'),(112,117,118,'imgFrame2147223838'),(121,126,127,'imgFrame2147223839'),(130,135,136,'imgFrame2147223841')]:
    reviews+=f'<article class="review-card">{img("imgImage58","","quote-mark")}<blockquote>{txt(body)}</blockquote><div class="review-author">{img(avatar,"","avatar", "loading=\"lazy\"")}<div><h3>{txt(name)}</h3><p>{txt(location)}</p></div></div></article>'
out += [f'<section class="reviews section blue carousel" aria-label="Client reviews">{heading(txt(89),txt(90),"container")}<div class="carousel-track reviews-track" tabindex="0">{reviews}</div>{arrows("reviews")}</section>']
def contact_cards():
    return f'<div class="contact-links">{btn(img("imgImage11")+"<span><strong>Book a strategy call</strong><small>Speak with a Consultant</small></span>"+img("imgArrow1"),"data-open-modal","contact-link")}<a class="contact-link" href="mailto:info@company.com">{img("imgImage19")}<span><strong>Email Us Directly</strong><small>Fast Response. No Sales Pitch.</small></span>{img("imgArrow1")}</a></div>'
pricing=''
for plan,price,unit,first in [('full-time','999','/month','160 Hours per month'),('hourly','13','/hour','Up to 160 Hours per month')]:
    features=[first,'Dedicated Virtual Assistant','Free replacement','Customer Success Manager','Rigorous quality control and supervision','Wing Workspace App','Your timezone – Any hours you want','Share with colleagues','Unlimited file sharing/storage']
    pricing+=f'<article class="price-card"><p class="plan-label">{"Full Time VA" if plan=="full-time" else "Pay As You Go"}</p><h3>USD {price}<small>{unit}</small></h3><ul>'+''.join(f'<li>{img("imgImage27")}{v}</li>' for v in features)+f'</ul>{btn("Start Free Trial",f"data-open-modal data-plan=\"{plan}\"")}</article>'
out += [f'<section class="pricing section container" id="plans">{heading("Transparent Plans. <span class=\"gradient-text\">No Long-Term Lock-ins.</span>",txt(189))}<div class="pricing-grid"><aside><h3>Need Help?</h3>{contact_cards()}</aside>{pricing}</div></section>']
out += [f'<section class="trial section blue" id="trial"><div class="container trial-grid"><div class="trial-copy"><h2>{txt(467)}</h2><p>{txt(468)}</p>{contact_cards()}<div class="tags"><span>Remote Team</span><span>24/7 Support</span><span>No Automation Bots</span></div></div><div class="form-card" data-form-slot="inline"></div></div></section>']
faq=''
for i,n in enumerate([291,295,300,304,308]):
    answer=txt(297) if i==1 else 'Demo placeholder: the answer to this question will be added here.'
    faq+=f'<div class="faq-item"><h3><button class="accordion-trigger" aria-expanded="false" aria-controls="faq-panel-{i}">{txt(n)}<span class="toggle-icon" aria-hidden="true"></span></button></h3><div class="accordion-panel" id="faq-panel-{i}" hidden><p>{answer}</p></div></div>'
out += [f'<section class="faq section container">{heading("Frequently Asked <span class=\"gradient-text\">Questions</span>")}<div class="faq-list">{faq}</div></section>']
out += [f'<footer class="footer blue"><div class="container"><div class="footer-cta">{heading(txt(314),txt(315))}{btn("Schedule a Free Consultation","data-open-modal","button button-white")}</div><div class="footer-details">{img("imgLogo1","DedicatedVA","brand", "width=\"188\" height=\"40\"")}<p>{txt(321)}</p><a href="mailto:info@company.com">{txt(322)}</a></div><div class="footer-bottom"><p>{txt(325)}</p><div><a href="https://dedicatedva.com/privacy-policy/">Privacy Policy</a><a href="https://dedicatedva.com/terms-and-conditions/">Terms and Conditions</a></div></div></div></footer></main>']
out += ['''<dialog id="consultation-modal" aria-labelledby="modal-title"><button type="button" class="modal-close" aria-label="Close consultation form">×</button><div class="form-card" data-form-slot="modal"></div></dialog>
<template id="trial-form-template"><h2>Claim Your Free Trial &amp; See Your Savings</h2><form class="trial-form"><div class="field-row"><label>Full Name *<input name="name" autocomplete="name" placeholder="e.g. Dr. Thomas Müller" required></label><label>Company Name<input name="company" autocomplete="organization" placeholder="e.g. Müller &amp; Söhne GmbH"></label></div><div class="field-row"><label>Corporate Email *<input name="email" type="email" autocomplete="email" placeholder="e.g. t.mueller@company.de" required></label><label>Phone Number *<input name="phone" type="tel" autocomplete="tel" placeholder="e.g. +49 9122 982110" required></label></div><fieldset><legend>Which plan fits your budget?</legend><div class="budget-options"><label><input type="radio" name="plan" value="full-time"> Full-Time $999/mo</label><label><input type="radio" name="plan" value="hourly"> Hourly $13/hr</label><label><input type="radio" name="plan" value="unsure"> Not Sure Yet</label></div></fieldset><label>How can we assist you?<textarea name="message" placeholder="Describe" rows="3"></textarea></label><label class="consent"><input type="checkbox" name="consent" required><span>I acknowledge that my contact data is handled strictly in accordance with GDPR principles by the operators of BES Systemhaus GmbH for processing this consultation request. *</span></label><button type="submit" class="button">Start Your Risk-Free Trial</button><p class="form-status" role="status" hidden></p></form></template></body></html>''']
(root/'dist/index.html').write_text('\n'.join(out),encoding='utf-8')
print('Built semantic landing-page HTML')
