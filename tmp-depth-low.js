const fs=require('fs');
const lines=fs.readFileSync('postman/EduPro.postman_collection.json','utf8').split(/\r?\n/);
let inStr=false,esc=false,depth=0;
for(let ln=1;ln<=lines.length;ln++){
  const line=lines[ln-1];
  for(let i=0;i<line.length;i++){
    const c=line[i];
    if(inStr){ if(esc) esc=false; else if(c==='\\') esc=true; else if(c==='"') inStr=false; continue; }
    if(c==='"'){ inStr=true; continue; }
    if(c==='{'||c==='[') depth++;
    else if(c==='}'||c===']') depth--;
  }
  if(ln>=4166 && ln<=5045 && depth<=2){
    console.log(String(ln).padStart(6), 'depth', depth, '|', line.trim());
  }
}
