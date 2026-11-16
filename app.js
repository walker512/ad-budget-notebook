'use strict';
const $=id=>document.getElementById(id);let model=null,report=null,sequence=0;
function el(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;}
function status(s){$('status').textContent=s;}
function clear(){report=null;$('results').textContent='';$('json').disabled=true;$('csv').disabled=true;}
function changed(){sequence++;clear();status('Inputs changed. Run the self-check again.');}
function campaign(){return {name:'',budget:null,spent:null,daily:null,uplift:null};}
function blank(){return {title:'',marketplace:'',currency:'',timeZone:'',start:'',end:'',through:'',reviewDate:'',spendSource:'',rule:{source:'',checked:'',validThrough:''},campaigns:[campaign()]};}
function load(d,message){sequence++;model=JSON.parse(JSON.stringify(d));clear();draw();status(message);}
function field(parent,o,key,label,type='text',hint=''){
 const wrap=el('label'),caption=el('span',label),control=el('input');control.type=type;control.value=o[key]??'';control.setAttribute('aria-label',label);if(type==='number'){control.min='0';control.step='any';}
 control.addEventListener('input',()=>{o[key]=type==='number'?(control.value===''?null:Number(control.value)):control.value;changed();});wrap.appendChild(caption);wrap.appendChild(control);if(hint)wrap.appendChild(el('small',hint));parent.appendChild(wrap);
}
function section(parent,title){const s=el('fieldset');s.appendChild(el('legend',title));parent.appendChild(s);return s;}
function draw(){
 const root=$('editor');root.textContent='';
 const context=section(root,'01 / One reporting scope');
 field(context,model,'title','Notebook title');field(context,model,'marketplace','Marketplace / advertising product','text','Use a single marketplace and Sponsored Products scope.');
 field(context,model,'currency','Currency code','text','Three uppercase letters. All figures must use the same currency.');field(context,model,'timeZone','Account reporting time zone','text','Dates are your local calendar dates; no automatic conversion.');
 field(context,model,'start','Planning period start','date');field(context,model,'end','Planning period end','date');
 field(context,model,'through','Spend complete through (end of day)','date','Include only fully completed days.');field(context,model,'reviewDate','Review date','date','Must be after the completed spend date.');
 field(context,model,'spendSource','Spend report / basis','text','Use the same attribution, taxes and reporting basis across campaigns.');
 const rules=el('details');rules.className='rule-panel';rules.appendChild(el('summary','02 / Optional: evidence for a percentage-only illustration'));
 rules.appendChild(el('p','Not a platform cap. The illustration assumes sufficient carryover and ignores account/portfolio caps and other rules. Leave uplift blank when unknown. Source notes are never fetched or verified.'));
 const group=section(rules,'Your rule notes');field(group,model.rule,'source','Rule source / observed setting');field(group,model.rule,'checked','Rule checked date','date');field(group,model.rule,'validThrough','Recheck rule by','date','Your chosen recheck deadline, not an Amazon expiry date.');root.appendChild(rules);
 const campaigns=section(root,'03 / Campaign planning budgets');campaigns.appendChild(el('p','Your period planning budget is a personal spending plan, not an Amazon lifetime budget or account balance. Daily budget means the effective current setting, including known budget-rule changes. Do not mix paused and active periods without splitting the planning scope.'));
 model.campaigns.forEach((c,i)=>{const card=section(campaigns,'Campaign '+(i+1));card.className='campaign';field(card,c,'name','Campaign '+(i+1)+' name');field(card,c,'budget','Your period planning budget','number');field(card,c,'spent','Spend through completed day','number');field(card,c,'daily','Effective current daily budget','number');field(card,c,'uplift','Illustrative uplift % (optional)','number','Blank = unknown. No account setting is assumed.');
 const remove=el('button','Remove campaign');remove.type='button';remove.addEventListener('click',()=>{if(model.campaigns.length===1){status('Keep at least one campaign.');return;}model.campaigns.splice(i,1);changed();draw();});card.appendChild(remove);});
 const add=el('button','+ Add blank campaign');add.type='button';add.addEventListener('click',()=>{if(model.campaigns.length>=100){status('Maximum 100 campaigns.');return;}model.campaigns.push(campaign());changed();draw();});campaigns.appendChild(add);
}
function money(n){return n===null?'Not available':model.currency+' '+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function render(r){
 const root=$('results');root.textContent='';root.appendChild(el('h2','Your spending plan, made visible'));root.appendChild(el('p',r.elapsedDays+' completed days · '+r.remainingDays+' period days after the spend cutoff · '+r.timeZone));
 const grid=el('div');grid.className='stats';
 for(const [label,value] of [['Your period plan',r.totals.budget],['Recorded spend',r.totals.spent],['Remaining planning allowance',r.totals.remaining],['Remaining allowance / day',r.totals.remainingPerDay]]){const c=el('section');c.appendChild(el('small',label));c.appendChild(el('strong',money(value)));grid.appendChild(c);}root.appendChild(grid);
 root.appendChild(el('p','Aggregate allowance may hide individual campaign overruns. These are arithmetic allowances after the spend cutoff, not after the review date, and are not budget settings or recommendations. When the period is complete there is no remaining-day calculation.'));
 const rule=el('aside',r.rule.explanation);root.appendChild(rule);
 const labels={over_planning_budget:'Over your plan',period_complete:'Period complete',ahead_of_linear_plan:'Ahead of linear plan',within_linear_plan:'Within linear plan'};
 const scroll=el('div');scroll.className='table-scroll';scroll.setAttribute('tabindex','0');scroll.setAttribute('aria-label','Campaign comparison table; scroll horizontally for all columns');
 const table=el('table'),head=el('thead'),tr=el('tr');
 for(const t of ['Campaign / status','Spend','Linear plan to date','Difference','Remaining plan','Allowance/day left','Constant-pace total*','Daily illustration**'])tr.appendChild(el('th',t));head.appendChild(tr);table.appendChild(head);
 const body=el('tbody');for(const x of r.rows){const row=el('tr'),name=el('td');name.appendChild(el('strong',x.name));name.appendChild(el('small',labels[x.status]));row.appendChild(name);for(const v of [x.spent,x.expectedByNow,x.variance,x.remaining,x.remainingPerDay,x.constantPaceTotal,x.stressDay])row.appendChild(el('td',money(v)));body.appendChild(row);}table.appendChild(body);scroll.appendChild(table);root.appendChild(scroll);
 root.appendChild(el('p','* Constant-pace total = recorded spend ÷ completed days × all period days. A mechanical scenario, not a forecast; future delivery and spend may differ.'));
 root.appendChild(el('p','** Percentage-only illustration = effective daily budget × (1 + your uplift / 100). Assumes enough unused carryover. It does not calculate Amazon’s available budget or maximum charge and ignores account/portfolio caps, rule interactions, edits and future changes.'));
 for(const x of r.rows)if(x.stressExceedsRemaining)root.appendChild(el('p',x.name+': the percentage-only day illustration exceeds this campaign’s remaining planning allowance. Review your assumptions manually; this app does not change anything.'));
 root.appendChild(el('p',r.notice));
}
function download(raw,name,type){const u=URL.createObjectURL(new Blob([raw],{type})),a=el('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
$('demo').addEventListener('click',()=>load(SAMPLE,'Fictional example loaded. Replace all amounts, dates and rule notes before use.'));
$('fresh').addEventListener('click',()=>load(blank(),'Blank notebook ready. Nothing is assumed about your account.'));
$('run').addEventListener('click',()=>{clear();try{report=analyze(model);render(report);$('json').disabled=false;$('csv').disabled=false;status('Self-check complete. No account changes were made.');}catch(e){status(e.message);}});
$('save').addEventListener('click',()=>{try{download(encodeProject(model),'ad-budget-notebook.json','application/json');status('Notebook download requested. Keep account details private.');}catch(e){status(e.message);}});
$('json').addEventListener('click',()=>{if(report)download(JSON.stringify(report,null,2),'ad-budget-report.json','application/json');});
$('csv').addEventListener('click',()=>{if(report)download(reportCSV(report),'ad-budget-report.csv','text/csv;charset=utf-8');});
$('restore').addEventListener('change',async()=>{const ticket=++sequence,file=$('restore').files&&$('restore').files[0];if(!file)return;try{if(file.size>MAX_BYTES)throw Error('Notebook exceeds 500000 UTF-8 bytes');status('Reading local notebook…');const raw=await file.text();if(ticket!==sequence)return;const data=decodeProject(raw);load(data,'Notebook restored. Run the self-check again.');}catch(e){if(ticket===sequence)status(e.message+' Import cancelled; current inputs and report are unchanged.');}finally{$('restore').value='';}});
load(blank(),'Start with your own figures, or explore the fictional example. Save before closing.');
