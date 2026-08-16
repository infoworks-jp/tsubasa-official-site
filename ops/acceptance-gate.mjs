import fs from 'node:fs';
const a=JSON.parse(fs.readFileSync('ops/acceptance.json','utf8'));
const failed=Object.entries(a.gates).filter(([,v])=>v!==true).map(([k])=>k);
if(failed.length){console.error('INCOMPLETE: failed gates:',failed.join(', '));process.exit(1)}
console.log('ACCEPTANCE_SUCCESS: all gates passed');
