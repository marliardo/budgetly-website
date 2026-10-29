const fs = require('node:fs');
const path = require('node:path');
for (const page of ['index.html', 'privacy/index.html']) {
  const content = fs.readFileSync(path.join(__dirname, 'dist', page), 'utf8');
  for (const [, url] of content.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!url.startsWith('/')) continue;
    const file = path.join(__dirname, 'dist', url.endsWith('/') ? `${url}index.html` : url);
    if (!fs.existsSync(file)) throw new Error(`Missing link target: ${url}`);
  }
  if (!content.includes('name="viewport"') || !content.includes('<title>')) throw new Error('Missing page metadata');
  console.log(`${page}: local links and page metadata passed`);
}
