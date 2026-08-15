import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const claim=process.argv[2];
const s=JSON.parse(fs.readFileSync('ops/execution-state.json','utf8'));
const exists=sha=>{
  try{execFileSync('git',['cat-file','-e',`${sha}^{commit}`],{stdio:'ignore'});return true}catch{return false}
};

if(claim==='started'){
  if(!s.write_started_commit || !exists(s.write_started_commit)){
    console.error('DENY STARTED CLAIM: no verifiable repository write commit');
    process.exit(1);
  }
  console.log(`ALLOW STARTED CLAIM: ${s.write_started_commit}`);
  process.exit(0);
}

if(claim==='complete'){
  const evidence=s.visual_evidence||{};
  const timed=['desktop','mobile'].every(d=>['s0','s1','s3','s5'].every(t=>Boolean(evidence[d]?.[t])));
  if(s.status!=='VISUAL_VERIFIED' || !evidence.passed || !evidence.qa_run_id || !timed || !s.implementation_commit || !exists(s.implementation_commit)){
    console.error('DENY COMPLETE CLAIM: public timed visual evidence is incomplete');
    process.exit(1);
  }
  console.log(`ALLOW COMPLETE CLAIM: task=${s.task_id} qa_run=${evidence.qa_run_id}`);
  process.exit(0);
}

console.error('Usage: node ops/claim-gate.mjs started|complete');
process.exit(2);
