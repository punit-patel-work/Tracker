// Optional browser smoke test. Install Playwright in .tmp/ai-browser; uses synthetic preview APIs only.
import { chromium } from '../.tmp/ai-browser/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
const preview=spawn(process.execPath,['scripts/preview-ui.mjs'],{cwd:process.cwd(),windowsHide:true,stdio:'pipe'});
let browser;
try {
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Preview did not start')),20000);preview.stdout.on('data',s=>{if(String(s).includes('5174')){clearTimeout(timeout);resolve();}});preview.on('error',reject);});
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const draft={id:'preview-ai-draft',task:'routine',createdAt:new Date().toISOString(),model:'preview',costUsd:0,result:{title:'Three-day foundation',explanation:'A sample plan showing how suggestions become editable routine targets. Choose comfortable loads and review the movements before saving.',limitations:['Sample data for interface verification.'],days:[{name:'Monday · Full body',focus:'A balanced start to the week',estimatedMinutes:40,exercises:[
 {exerciseId:'EX-101',targetSets:3,targetReps:10,targetWeightKg:null,restSec:90,targetDurationSec:null,targetCardioMin:null,reason:'A supported pressing movement for this sample session.',loadReason:'Choose a starting load during warm-up.'},
 {exerciseId:'EX-102',targetSets:2,targetReps:12,targetWeightKg:null,restSec:60,targetDurationSec:null,targetCardioMin:null,reason:'An example accessory movement.',loadReason:'Choose a comfortable starting load.'}
 ]}]}};
 await page.route('**/api/ai/**',async route=>{
  const path=new URL(route.request().url()).pathname;
  let data={};
  if(path.endsWith('/bootstrap'))data={preferences:null,aiTier:'pro',enabled:true,configured:true,equipment:[],drafts:[draft]};
  else if(path.includes('/coaching/weeks/'))data={revision:-1,slots:[],completed:[],preferredDays:[]};
  else if(path.endsWith('/routine-draft'))data={draft,cached:false};
  else if(path.includes('/drafts/')&&path.endsWith('/save'))data={routineId:'preview-saved'};
  else if(path.endsWith('/admin'))data={config:{enabled:true,monthlyBudgetUsd:5},ledger:{usedUsd:.096,reservedUsd:0,requests:3},items:[],groups:[{_id:'routine',requests:1,costUsd:.096,inputTokens:27000,outputTokens:2600}],configured:true,models:{routine:'gpt-6.1-sol',insights:'gpt-6-luna'}};
  else if(path.includes('/alternatives/'))data={alternatives:[]};
  else throw new Error('Unmocked AI request: '+path);
  await route.fulfill({json:data});
 });
 await page.route('**/api/auth/me',async route=>{const response=await route.fetch();const data=await response.json();data.user.role='admin';data.user.isOwner=true;await route.fulfill({json:data});});
 await page.goto('http://127.0.0.1:5174');
 await page.getByRole('button',{name:'AI Coach',exact:true}).filter({visible:true}).click();
 await page.getByText('Goals & schedule',{exact:true}).waitFor();
 await fs.mkdir('docs',{recursive:true});
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:'docs/ai-phase1-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByLabel('Training experience').selectOption('beginner');
 await page.getByLabel('Months of previous training').fill('6');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.setViewportSize({width:390,height:844});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth))throw new Error('Mobile form overflows');
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:'docs/ai-phase1-mobile.png',fullPage:true});
 await page.getByLabel(/Use my selected profile/).check();
 await page.getByRole('button',{name:'Generate my routine',exact:true}).click();
 await page.getByText('Three-day foundation',{exact:true}).waitFor();
 if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth))throw new Error('Mobile routine overflows');
 await page.setViewportSize({width:1440,height:1000});
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:'docs/ai-phase1-routine.png',fullPage:true});
 await page.getByRole('button',{name:'Save this session to routines'}).click();
 await page.getByText('Saved to routines',{exact:true}).waitFor();
 await page.goto('http://127.0.0.1:5174/admin#ai');
 await page.getByText('AI controls',{exact:true}).waitFor();
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:'docs/ai-phase1-admin.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth))throw new Error('Mobile admin overflows');
 await page.getByRole('button',{name:'Switch to dark mode'}).click();
 await page.screenshot({path:'docs/ai-phase1-admin-dark.png',fullPage:true});
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('Browser checks passed: questionnaire, mobile layout, editable preview, save action, admin usage; no console errors.');
}finally{await browser?.close();preview.kill();}
