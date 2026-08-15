import fs from 'node:fs';

const p='ops/execution-state.json';
if(!fs.existsSync(p)) throw new Error('Missing ops/execution-state.json');
const s=JSON.parse(fs.readFileSync(p,'utf8'));
const allowed=new Set(['REQUESTED','WRITE_STARTED','COMMITTED','DEPLOYED','VISUAL_VERIFIED','STOPPED_INCOMPLETE']);
if(!allowed.has(s.status)) throw new Error(`Invalid status: ${s.status}`);

const rank={REQUESTED:0,WRITE_STARTED:1,COMMITTED:2,DEPLOYED:3,VISUAL_VERIFIED:4,STOPPED_INCOMPLETE:-1};
if(rank[s.status]>=1 && !s.write_started_commit) throw new Error('Started state requires write_started_commit');
if(rank[s.status]>=2 && !s.implementation_commit) throw new Error('Committed state requires implementation_commit');
if(rank[s.status]>=3 && !s.deployed_url) throw new Error('Deployed state requires deployed_url');

if(s.status==='VISUAL_VERIFIED'){
  if(!s.visual_evidence?.passed) throw new Error('VISUAL_VERIFIED requires visual_evidence.passed=true');
  if(!s.visual_evidence?.qa_run_id) throw new Error('VISUAL_VERIFIED requires qa_run_id');
  for(const device of ['desktop','mobile']){
    for(const t of ['s0','s1','s3','s5']){
      if(!s.visual_evidence?.[device]?.[t]) throw new Error(`VISUAL_VERIFIED requires ${device}.${t} evidence`);
    }
  }
}

console.log(JSON.stringify({ok:true,task_id:s.task_id,status:s.status,write_started_commit:s.write_started_commit,implementation_commit:s.implementation_commit},null,2));
