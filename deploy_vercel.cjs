const { execSync } = require('child_process');
const fs = require('fs');

const VERCEL_JSON = 'vercel.json';

// Clean vercel.json - remove experimentalServices each time
function cleanVercelJson() {
  const raw = fs.readFileSync(VERCEL_JSON, 'utf8');
  const json = JSON.parse(raw);
  delete json.experimentalServices;
  delete json.name;
  json.buildCommand = "npm install --legacy-peer-deps && npm run build";
  json.outputDirectory = "dist";
  fs.writeFileSync(VERCEL_JSON, JSON.stringify(json, null, 2));
  console.log('✅ vercel.json cleaned');
}

function run(cmd) {
  console.log(`\n▶ Running: ${cmd}`);
  try {
    const out = execSync(cmd, { stdio: 'pipe', encoding: 'utf8', timeout: 120000 });
    console.log(out);
    return out;
  } catch (e) {
    console.log(e.stdout || '');
    console.error(e.stderr || '');
    return e.stdout || '';
  }
}

// Step 1: Clean vercel.json
cleanVercelJson();

// Step 2: Pull project settings
run('npx vercel pull --yes --environment production');
cleanVercelJson(); // Clean again after pull

// Step 3: Build locally
run('npx vercel build --prod --yes');
cleanVercelJson(); // Clean again after build

// Step 4: Deploy prebuilt
const result = run('npx vercel deploy --prebuilt --prod --yes');
console.log('\n🚀 Deployment result:\n', result);
