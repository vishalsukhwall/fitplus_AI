const fs = require('fs');
const files = [
  'src/main.jsx','src/App.jsx','src/index.css','index.html',
  'src/components/Navbar.jsx','src/components/Hero.jsx',
  'src/components/Features.jsx','src/components/Pricing.jsx',
  'src/components/Testimonials.jsx','src/components/FAQ.jsx',
  'src/components/Footer.jsx'
];
let allOk = true;
files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const isJsx   = f.endsWith('.jsx');
  const isCss   = f.endsWith('.css');
  const isHtml  = f.endsWith('.html');
  const hasExportDefault = isJsx  ? /export default/.test(c) : true;
  const hasTailwind      = isCss  ? c.includes('@tailwind base') : true;
  const hasRootDiv       = isHtml ? c.includes('id="root"') : true;
  const hasScript        = isHtml ? c.includes('src/main.jsx') : true;
  const noBrandIcons     = (isJsx && c.includes('lucide-react'))
    ? !/(Twitter|Instagram|Youtube|Github|Linkedin)[^I]/.test(c)
    : true;
  const ok = hasExportDefault && hasTailwind && hasRootDiv && hasScript && noBrandIcons;
  if (!ok) allOk = false;
  const issues = [];
  if (!hasExportDefault) issues.push('MISSING export default');
  if (!hasTailwind)      issues.push('MISSING @tailwind base');
  if (!hasRootDiv)       issues.push('MISSING id=root');
  if (!hasScript)        issues.push('MISSING script tag');
  if (!noBrandIcons)     issues.push('HAS removed brand icons');
  console.log((ok ? 'OK ' : 'BAD') + '  ' + f + (issues.length ? '   --> ' + issues.join(', ') : ''));
});
console.log(allOk ? '\nALL FILES PASS' : '\nFIX REQUIRED');
