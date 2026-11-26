#!/usr/bin/env node
// Builds every legal page + the data file the homepage reads.
//   node legal/build.mjs
// Run it again after editing projects.json, legal/apps.mjs or legal/fragments/*.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apps, generic, DEVELOPER, UPDATED } from './apps.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://karakusapp.github.io/apps';
const projects = JSON.parse(fs.readFileSync(path.join(ROOT, 'projects.json'), 'utf8')).projects;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/^[\divxlc]+\.\s*/i, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const mail = `<a href="mailto:${DEVELOPER.email}">${DEVELOPER.email}</a>`;
const write = (rel, html) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log('  ✓', rel);
};

// ---------- section helpers ----------
let n = 0;
const h2 = (t) => `<h2>${++n}. ${t}</h2>`;
const dl = (rows) => `<ul class="defs">${rows.map(([k, v]) => `<li><strong>${k}</strong><span>${v}</span></li>`).join('')}</ul>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const box = (title, body, kind = 'note') => `<div class="callout callout-${kind}"><strong>${title}</strong><p>${body}</p></div>`;

function privacyBody(name, a) {
  n = 0;
  const kids = a.children === 'kids';
  const out = [];
  out.push(h2('Introduction'));
  out.push(`<p>This Privacy Policy explains how <strong>${name}</strong> (the “App”), developed by ${DEVELOPER.name} (“we”, “us”), collects, uses and protects information when you use the App. It applies only to ${name}. Each of our apps has its own policy.</p>`);

  out.push(h2('Information We Collect'));
  out.push('<h3>Information you provide</h3>');
  out.push(dl([...a.collect, ['Support messages', 'Your email address and message if you contact us.']]));
  out.push('<h3>Collected automatically</h3>');
  out.push(dl(kids
    ? [['Purchase status', 'Which items are unlocked, provided by Apple. Payment details are never received by us.']]
    : [
        ['Purchases', 'Subscription status, product identifiers and an anonymous app user identifier. Payment card details are handled by Apple and never reach us.'],
        ['Usage & diagnostics', 'App interactions, device model, OS version, approximate region, performance data and crash logs.'],
      ]));
  out.push('<p>We do not require you to create an account, and we do not collect your name, contacts or advertising identifier (IDFA).</p>');

  if (a.permissions.length) {
    out.push(h2('Device Permissions'));
    out.push('<p>The App asks for the following permissions only when you use a feature that needs them. You can change them at any time in iOS <em>Settings › ' + esc(name) + '</em>.</p>');
    out.push(dl(a.permissions));
  }

  out.push(h2(a.special.title));
  a.special.body.forEach((p) => out.push(`<p>${p}</p>`));

  out.push(h2('How We Use Information'));
  out.push(ul([
    'To provide the App’s features you request',
    ...(kids ? [] : ['To understand how the App is used and fix crashes and bugs']),
    'To manage purchases and restore unlocked content',
    'To answer your support requests',
    'To comply with legal obligations and keep the App secure',
  ]));
  out.push('<p>We do <strong>not</strong> sell your personal information, and we do not use it for third-party advertising or cross-app tracking.</p>');

  out.push(h2('Third-Party Services'));
  out.push('<p>We use the following providers to operate the App. They process data only on our behalf and under their own privacy policies:</p>');
  out.push(`<div class="table-wrap"><table><thead><tr><th>Service</th><th>Purpose</th><th>Data</th></tr></thead><tbody>${a.thirdParties
    .map((t) => `<tr><td><strong>${t.name}</strong></td><td>${t.purpose}</td><td>${t.data}</td></tr>`)
    .join('')}</tbody></table></div>`);

  out.push(h2('Data Retention'));
  out.push(dl([...a.retention, ['Support emails', 'Kept as long as needed to resolve your request.']]));

  out.push(h2('Your Choices & Rights'));
  out.push(ul([
    'Revoke permissions at any time in iOS Settings.',
    'Delete data stored in the App from within the App, or by deleting the App.',
    'Manage or cancel subscriptions in <em>Settings › Apple ID › Subscriptions</em>.',
    `Depending on where you live (for example under the GDPR, KVKK or CCPA), you may have the right to access, correct, delete or object to processing of your personal data. Email ${mail} and we will respond within the period required by law.`,
  ]));

  out.push(h2('Children’s Privacy'));
  if (kids) {
    out.push(`<p>${name} is directed to children. We do not knowingly collect personal information from children, there is no third-party advertising or analytics in the App, and purchases and external links are protected by a parental gate.</p>`);
    out.push(`<p>If you are a parent or guardian and believe your child has provided personal information to us, contact ${mail} and we will delete it.</p>`);
  } else {
    out.push(`<p>The App is not directed to children under ${a.children}. We do not knowingly collect personal information from children under ${a.children}. If you believe a child has provided us with personal information, contact ${mail} and we will delete it.</p>`);
  }

  out.push(h2('Security'));
  out.push('<p>Data sent from the App is encrypted in transit using HTTPS/TLS. We limit access to the minimum necessary and choose providers with strong security practices. No method of transmission or storage is 100% secure, but we work to protect your information.</p>');

  out.push(h2('International Transfers'));
  out.push('<p>Our service providers may process data in countries other than your own, including the United States and the European Union. Where required, transfers are protected by appropriate safeguards such as standard contractual clauses.</p>');

  out.push(h2('Changes to This Policy'));
  out.push('<p>We may update this policy when the App or the law changes. The “Last updated” date above shows the latest version. Material changes will be highlighted in the App.</p>');

  out.push(h2('Contact'));
  out.push(`<p>Questions or requests about ${name}’s privacy? Email ${mail} and mention “${esc(name)}” in the subject.</p>`);
  return out.join('\n');
}

function termsBody(name, a, privacyHref) {
  n = 0;
  const kids = a.children === 'kids';
  const out = [];
  out.push(h2('Acceptance of Terms'));
  out.push(`<p>These Terms of Use (“Terms”) are an agreement between you and ${DEVELOPER.name} (“we”, “us”) for the use of <strong>${name}</strong> (the “App”). By downloading or using the App you agree to these Terms. If you do not agree, do not use the App.</p>`);

  out.push(h2('Eligibility'));
  out.push(kids
    ? `<p>${name} is designed for children. A parent or legal guardian must review and accept these Terms on the child’s behalf and supervise the child’s use of the App.</p>`
    : `<p>You must be at least ${a.children} years old to use the App. If you are under the age of majority where you live, you may use the App only with the involvement and consent of a parent or guardian.</p>`);

  out.push(h2('The Service'));
  out.push(`<p>${name} provides:</p>`);
  out.push(ul(a.features));
  out.push('<p>We may add, change or remove features at any time to improve the App.</p>');

  if (a.notice) {
    out.push(h2(a.notice.title));
    out.push(box('Important', a.notice.body, 'warn'));
  }

  out.push(h2('License'));
  out.push('<p>We grant you a personal, non-exclusive, non-transferable, revocable license to use the App on Apple devices you own or control, as permitted by the Apple Media Services Terms. You may not copy, modify, reverse engineer, resell or distribute the App.</p>');

  if (a.subscription) {
    out.push(h2('Purchases & Subscriptions'));
    if (kids) {
      out.push('<p>Some content may be unlocked through in-app purchases. Purchases can only be started by an adult after passing the parental gate, and are processed by Apple and charged to the Apple ID on the device.</p>');
    } else {
      out.push(ul([
        'Some features require a paid subscription or one-time purchase. Prices are shown in the App before you buy.',
        'Payment is charged to your Apple ID at confirmation of purchase.',
        'Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period. Your account is charged for renewal within 24 hours before the end of the period.',
        'If a free trial is offered, any unused portion is forfeited when you purchase a subscription.',
        'You can manage or cancel subscriptions in <em>Settings › Apple ID › Subscriptions</em>. Deleting the App does not cancel a subscription.',
      ]));
    }
    out.push('<p>All refunds are handled by Apple according to its policies. You can request one at <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener">reportaproblem.apple.com</a>.</p>');
  }

  if (a.userContent) {
    out.push(h2('Your Content'));
    out.push('<p>You keep ownership of the content you create or submit in the App. You give us a limited license to process that content solely to provide the App’s features to you. You are responsible for having the rights to anything you submit.</p>');
  }

  out.push(h2('Acceptable Use'));
  out.push('<p>You agree not to:</p>');
  out.push(ul([
    'Use the App for any unlawful purpose or in violation of others’ rights',
    'Attempt to access, interfere with or overload our systems or providers',
    'Reverse engineer, decompile or bypass any security or purchase mechanism',
    'Use automated means to access the App or scrape its content',
  ]));

  out.push(h2('Privacy'));
  out.push(`<p>Our <a href="${privacyHref}">${name} Privacy Policy</a> explains what data the App collects and how it is used. It is part of these Terms.</p>`);

  out.push(h2('Intellectual Property'));
  out.push(`<p>The App, including its design, code, graphics and name, is owned by ${DEVELOPER.name} and protected by intellectual property laws. Nothing in these Terms transfers those rights to you.</p>`);

  out.push(h2('Disclaimer of Warranties'));
  out.push('<p>The App is provided “as is” and “as available”, without warranties of any kind, express or implied, including fitness for a particular purpose, accuracy or uninterrupted availability, to the fullest extent permitted by law.</p>');

  out.push(h2('Limitation of Liability'));
  out.push('<p>To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special or consequential damages, or for any loss of data or profits, arising from your use of the App. Our total liability will not exceed the amount you paid for the App in the twelve months before the claim. Nothing in these Terms limits rights you have under mandatory consumer law.</p>');

  out.push(h2('Termination'));
  out.push('<p>You may stop using the App at any time by deleting it. We may suspend or end your access if you breach these Terms. Sections that by their nature should survive termination will survive.</p>');

  out.push(h2('Apple Terms'));
  out.push(`<p>These Terms are between you and us, not Apple. Apple is not responsible for the App or its content, has no obligation to provide maintenance or support, and is not responsible for any product claims. If the App fails to conform to an applicable warranty, you may notify Apple for a refund of the purchase price, if any. Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you. You confirm you are not located in a country subject to a U.S. Government embargo and are not on any U.S. Government restricted-party list.</p>`);

  out.push(h2('Governing Law'));
  out.push(`<p>These Terms are governed by the laws of ${DEVELOPER.country}. Disputes will be resolved by the courts of ${DEVELOPER.country}, unless mandatory consumer law in your country of residence gives you the right to bring a claim locally.</p>`);

  out.push(h2('Changes to These Terms'));
  out.push('<p>We may update these Terms from time to time. The “Last updated” date shows the current version. Continuing to use the App after changes means you accept the updated Terms.</p>');

  out.push(h2('Contact'));
  out.push(`<p>Questions about these Terms? Email ${mail} and mention “${esc(name)}” in the subject.</p>`);
  return out.join('\n');
}

// Adds ids to <h2> and builds the table of contents.
function withToc(body) {
  const toc = [];
  const seen = new Set();
  const html = body.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (_, attrs, inner) => {
    let id = slugify(inner) || 'section';
    while (seen.has(id)) id += '-2';
    seen.add(id);
    const label = inner.replace(/<[^>]+>/g, '').replace(/^\s*[\divxlc]+\.\s*/i, '').trim();
    toc.push({ id, label });
    return `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
  return { html, toc };
}

function page({ base, kind, name, tagline, emoji, accent, updated, body, summary, otherHref, otherLabel, canonical, appStoreId, isWebsite }) {
  const title = `${kind} — ${name}`;
  const { html, toc } = withToc(body);
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 220));
  const switcher = otherHref
    ? `<nav class="doc-switch" aria-label="Document">
        <a href="${kind === 'Privacy Policy' ? '#' : otherHref}" ${kind === 'Privacy Policy' ? 'aria-current="page"' : ''}>Privacy</a>
        <a href="${kind === 'Terms of Use' ? '#' : otherHref}" ${kind === 'Terms of Use' ? 'aria-current="page"' : ''}>Terms</a>
      </nav>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(`${kind} for ${name}${tagline ? ' – ' + tagline : ''}.`)}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#08080c">
  <link rel="canonical" href="${SITE}/${canonical}">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${base}assets/css/legal.css">
  <style>:root{--app:${accent}}</style>
</head>
<body>
  <div class="progress" aria-hidden="true"></div>
  <div class="glow" aria-hidden="true"></div>

  <header class="lnav">
    <a class="brand" href="${base}index.html"><span class="brand-dot"></span>Rıza Erdi Karakuş</a>
    ${switcher}
    <a class="lnav-back" href="${base}index.html${isWebsite ? '' : '#legal'}">${isWebsite ? 'Home' : 'All apps'} <span aria-hidden="true">↗</span></a>
  </header>

  <main>
    <section class="lhero">
      <div class="app-chip"><span class="app-chip-icon">${emoji}</span><span><strong>${esc(name)}</strong>${tagline ? `<small>${esc(tagline)}</small>` : ''}</span></div>
      <h1>${kind}</h1>
      <p class="meta"><span>Last updated ${esc(updated)}</span><span>·</span><span>${mins} min read</span></p>
      ${summary && summary.length ? `<div class="glance"><p class="glance-title">At a glance</p><ul>${summary.map((s) => `<li>${s}</li>`).join('')}</ul></div>` : ''}
    </section>

    <div class="lwrap">
      <aside class="toc" aria-label="On this page">
        <p class="toc-title">On this page</p>
        <ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.label)}</a></li>`).join('')}</ol>
      </aside>
      <article class="doc">
${html}
      </article>
    </div>

    <section class="lcta">
      ${otherHref ? `<a class="lcta-card" href="${otherHref}"><small>Also for ${esc(name)}</small><span>${otherLabel} →</span></a>` : ''}
      ${appStoreId && /^\d+$/.test(appStoreId) ? `<a class="lcta-card" href="https://apps.apple.com/app/id${appStoreId}" target="_blank" rel="noopener"><small>Get the app</small><span>View on the App Store ↗</span></a>` : ''}
      <a class="lcta-card" href="mailto:${DEVELOPER.email}?subject=${encodeURIComponent(name)}"><small>Questions?</small><span>${DEVELOPER.email}</span></a>
    </section>
  </main>

  <footer class="lfoot">
    <span>© ${new Date().getFullYear()} ${DEVELOPER.name}</span>
    <a href="#top" data-top>Back to top ↑</a>
  </footer>
  <script src="${base}assets/js/legal.js" defer></script>
</body>
</html>
`;
}

const fragment = (f) => fs.readFileSync(path.join(ROOT, 'legal/fragments', f), 'utf8');

console.log('Legal pages');
for (const p of projects) {
  const a = apps[p.id];
  if (!a) { console.warn('  ! no legal data for', p.id); continue; }
  const dir = path.dirname(p.legal.privacyUrl);
  const common = { base: '../', name: p.title, tagline: p.tagline, emoji: p.emoji, accent: p.accent, appStoreId: p.appStoreId };
  const privacy = a.fragments ? fragment(a.fragments.privacy) : privacyBody(p.title, a);
  const terms = a.fragments ? fragment(a.fragments.terms) : termsBody(p.title, a, 'privacy.html');
  write(p.legal.privacyUrl, page({ ...common, kind: 'Privacy Policy', updated: a.updated?.privacy || UPDATED, body: privacy, summary: a.summary, otherHref: 'terms.html', otherLabel: 'Terms of Use', canonical: p.legal.privacyUrl }));
  write(p.legal.termsUrl, page({ ...common, kind: 'Terms of Use', updated: a.updated?.terms || UPDATED, body: terms, otherHref: 'privacy.html', otherLabel: 'Privacy Policy', canonical: p.legal.termsUrl }));
  if (dir !== path.dirname(p.legal.termsUrl)) console.warn('  ! privacy and terms are in different folders for', p.id);
}

// Old shared URLs — kept alive so existing App Store links never break.
const g = { base: '', name: generic.title, tagline: 'All apps', emoji: '📱', accent: '#FF8A5B' };
write('app-privacy.html', page({ ...g, kind: 'Privacy Policy', updated: UPDATED, body: privacyBody(generic.title, generic), summary: generic.summary, otherHref: 'app-terms.html', otherLabel: 'Terms of Use', canonical: 'app-privacy.html' }));
write('app-terms.html', page({ ...g, kind: 'Terms of Use', updated: UPDATED, body: termsBody(generic.title, generic, 'app-privacy.html'), otherHref: 'app-privacy.html', otherLabel: 'Privacy Policy', canonical: 'app-terms.html' }));
write('terms.html', page({ base: '', name: 'Website', tagline: 'karakuserdi.github.io', emoji: '🌐', accent: '#FF8A5B', kind: 'Terms of Use', updated: 'December 15, 2024', body: fragment('website-terms.html'), canonical: 'terms.html', isWebsite: true }));

// Homepage data (a script, so index.html also works when opened from disk).
write('assets/js/projects.js', `// Generated by legal/build.mjs from projects.json — do not edit by hand.\nwindow.PROJECTS = ${JSON.stringify(projects, null, 2)};\n`);

// Old detail-page URL → homepage modal.
write('project-template.html', `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Redirecting…</title><meta name="robots" content="noindex"><script>var id=new URLSearchParams(location.search).get('id');location.replace('index.html'+(id?'#app/'+encodeURIComponent(id):'#apps'));</script></head><body><a href="index.html">Continue</a></body></html>\n`);

// Sitemap
const today = new Date().toISOString().slice(0, 10);
const urls = ['', 'terms.html', ...projects.flatMap((p) => [p.legal.privacyUrl, p.legal.termsUrl])];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}/${u}</loc><lastmod>${today}</lastmod><priority>${u ? '0.5' : '1.0'}</priority></url>`).join('\n')}\n</urlset>\n`);
console.log('Done.');
