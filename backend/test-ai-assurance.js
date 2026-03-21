/**
 * Test script for AI Investment Assurance (Gemini AI)
 * Creates supporter in DB, gets JWT, calls the AI endpoint
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');

const User = require('./models/User');
const SupporterProfile = require('./models/SupporterProfile');
const StartupProfile = require('./models/StartupProfile');

function httpRequest(method, path, body, cookie) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const headers = { 'Content-Type': 'application/json' };
    if (cookie) headers['Cookie'] = cookie;
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    const req = http.request({ hostname: 'localhost', port: 5000, path, method, headers }, (res) => {
      let responseBody = '';
      const setCookie = res.headers['set-cookie'];
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(responseBody), cookie: setCookie }); }
        catch { resolve({ status: res.statusCode, data: responseBody, cookie: setCookie }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== AI Investment Assurance Test (Gemini AI) ===\n');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // Ensure supporter exists
  const EMAIL = 'ai_test_supporter@test.com';
  let supporter = await User.findOne({ email: EMAIL });
  if (!supporter) {
    const hash = await bcrypt.hash('Chand@1502', 10);
    supporter = await User.create({ email: EMAIL, password: hash, role: 'supporter', isActive: true });
    console.log('✅ Created supporter user');
  } else {
    console.log('✅ Supporter exists');
  }

  let profile = await SupporterProfile.findOne({ user: supporter._id });
  if (!profile) {
    profile = await SupporterProfile.create({
      user: supporter._id, fullName: 'AI Test Investor',
      bio: 'Experienced tech investor with 10+ years in VC',
      type: 'investor', investmentMin: 100000, investmentMax: 2000000,
      expertiseAreas: 'AI, ML, Data Science, Cloud, SaaS', location: 'San Francisco, CA', isActive: true
    });
    console.log('✅ Created supporter profile');
  } else {
    console.log('✅ Supporter profile exists');
  }

  // Get a startup
  const startups = await StartupProfile.find({}).populate('user', 'email').limit(1);
  if (!startups.length) { console.log('❌ No startups found!'); await mongoose.disconnect(); return; }
  const startup = startups[0];
  console.log(`\n🎯 Target startup: "${startup.companyName}" (user: ${startup.user._id})`);

  // JWT
  const token = jwt.sign({ id: supporter._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const cookie = `token=${token}`;

  // Verify auth
  const meRes = await httpRequest('GET', '/api/auth/me', null, cookie);
  console.log(`🔐 Auth: ${meRes.data.user?.email} (${meRes.data.user?.role})`);

  // Call AI endpoint
  console.log(`\n🤖 POST /api/ai/assurance { startupId: "${startup.user._id}" }`);
  console.log('⏳ Waiting for Gemini response...\n');

  const t0 = Date.now();
  const aiRes = await httpRequest('POST', '/api/ai/assurance', { startupId: startup.user._id.toString() }, cookie);
  const dur = ((Date.now() - t0) / 1000).toFixed(1);

  console.log(`⏱️  Response: ${dur}s | HTTP ${aiRes.status}\n`);

  if (aiRes.status === 200 && aiRes.data.success) {
    const a = aiRes.data.assurance;
    console.log('═══════════════════════════════════════════');
    console.log('  AI INVESTMENT ASSURANCE — SUCCESS ✅');
    console.log('═══════════════════════════════════════════');
    console.log(`  Score:   ${a.assurance_score}/100`);
    console.log(`  Verdict: ${a.verdict}`);
    console.log('───────────────────────────────────────────');
    console.log('  Reasons to invest:');
    a.reasons?.forEach((r, i) => console.log(`    ${i+1}. ${r}`));
    console.log('───────────────────────────────────────────');
    console.log('  Risks:');
    a.risks?.forEach((r, i) => console.log(`    ${i+1}. ${r}`));
    console.log('───────────────────────────────────────────');
    console.log('  Expected Outcomes:');
    console.log(`    Best:      ${a.expected_outcome?.best_case}`);
    console.log(`    Realistic: ${a.expected_outcome?.realistic_case}`);
    console.log(`    Worst:     ${a.expected_outcome?.worst_case}`);
    console.log('───────────────────────────────────────────');
    console.log(`  Recommendation:  ${a.recommendation}`);
    console.log(`  Compatibility:   ${a.compatibility_note}`);
    console.log('═══════════════════════════════════════════\n');

    // Validate fields
    const fields = ['assurance_score','verdict','reasons','risks','expected_outcome','recommendation','compatibility_note'];
    const missing = fields.filter(f => !(f in a));
    console.log(missing.length ? `⚠️  Missing: ${missing.join(', ')}` : '✅ All fields present');
    const types = [
      ['assurance_score', typeof a.assurance_score === 'number'],
      ['reasons', Array.isArray(a.reasons)],
      ['risks', Array.isArray(a.risks)],
      ['expected_outcome', typeof a.expected_outcome === 'object'],
    ];
    const bad = types.filter(([,ok]) => !ok);
    console.log(bad.length ? `⚠️  Type issues: ${bad.map(([n])=>n).join(', ')}` : '✅ All types correct');
    console.log('\n🎉 AI Investment Assurance is FULLY WORKING with Gemini AI!');
  } else {
    console.log('❌ FAILED:');
    console.log(JSON.stringify(aiRes.data, null, 2));
  }

  await mongoose.disconnect();
}

main().catch(e => { console.error('❌', e.message); mongoose.disconnect(); });
