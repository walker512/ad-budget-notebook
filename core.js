'use strict';
const MAX_BYTES=500000;
const NOTICE='Planning arithmetic only, not an Amazon spending cap or forecast. No account connection or changes. Delivery, sales and returns are not guaranteed.';
function obj(v,label){if(!v||typeof v!=='object'||Array.isArray(v))throw Error(label+' must be an object');}
function txt(v,label,max=500){if(typeof v!=='string'||!v.trim()||v.length>max)throw Error(label+' is required (maximum '+max+' characters)');return v.trim();}
function num(v,label,max=1000000000){if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>max)throw Error(label+' must be a number from 0 to '+max);return v;}
function date(v,label){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v||v<'1900-01-01')throw Error('Enter a valid '+label+' (YYYY-MM-DD, 1900 onward)');return v;}
function days(a,b){return Math.round((Date.parse(b)-Date.parse(a))/86400000)+1;}
function analyze(d){
 obj(d,'Notebook');const title=txt(d.title,'Notebook title'),marketplace=txt(d.marketplace,'Marketplace'),timeZone=txt(d.timeZone,'Reporting time zone');
 if(typeof d.currency!=='string'||!/^[A-Z]{3}$/.test(d.currency))throw Error('Currency must be a three-letter uppercase code; do not mix currencies');
 date(d.start,'period start');date(d.end,'period end');date(d.through,'spend complete-through date');date(d.reviewDate,'review date');
 if(d.start>d.end||days(d.start,d.end)>366)throw Error('Planning period must be 1–366 days');
 if(d.through<d.start||d.through>d.end)throw Error('Spend complete-through date must be inside the planning period');
 if(d.reviewDate<=d.through)throw Error('Review date must be after the completed spend date; do not use partial-day spend');
 const totalDays=days(d.start,d.end),elapsedDays=days(d.start,d.through),remainingDays=totalDays-elapsedDays;
 txt(d.spendSource,'Spend report source / basis');
 obj(d.rule,'Rule notes');let ruleState='missing',ruleExplanation='No complete rule evidence: daily uplift illustration is unavailable.';
 const evidence=[d.rule.source,d.rule.checked,d.rule.validThrough];
 for(const [k,label] of [['source','Rule source'],['checked','Rule checked date'],['validThrough','Rule recheck-by date']])if(d.rule[k]!==''&&d.rule[k]!==null&&d.rule[k]!==undefined){if(k==='source')txt(d.rule[k],label);else date(d.rule[k],label);}
 if(d.rule.checked&&d.rule.checked>d.reviewDate)throw Error('Rule checked date cannot be after the review date');
 if(d.rule.checked&&d.rule.validThrough&&d.rule.checked>d.rule.validThrough)throw Error('Rule recheck-by date cannot be before the checked date');
 if(evidence.every(v=>typeof v==='string'&&v.trim())){ruleState=d.rule.validThrough<d.reviewDate?'stale':'current';ruleExplanation=ruleState==='stale'?'Rule notes are past your recheck-by date: daily uplift illustration is unavailable.':'Rule notes are within your chosen recheck window, not verified by this app.';}
 if(!Array.isArray(d.campaigns)||d.campaigns.length<1||d.campaigns.length>100)throw Error('Enter 1–100 campaigns');const seen=new Set();
 const rows=d.campaigns.map(c=>{
 obj(c,'Campaign');const name=txt(c.name,'Campaign name');if(seen.has(name.toLowerCase()))throw Error('Campaign names must be unique');seen.add(name.toLowerCase());
 const budget=num(c.budget,name+' planning budget'),spent=num(c.spent,name+' completed-period spend'),daily=num(c.daily,name+' effective daily budget');
 const uplift=c.uplift===null||c.uplift===undefined?null:num(c.uplift,name+' illustrative uplift percent',1000);
 const expectedByNow=budget*elapsedDays/totalDays,remaining=budget-spent,pace=spent/elapsedDays;
 const stressDay=ruleState==='current'&&uplift!==null?daily*(1+uplift/100):null;
 const status=remaining< -1e-8?'over_planning_budget':remainingDays===0?'period_complete':spent>expectedByNow+1e-8?'ahead_of_linear_plan':'within_linear_plan';
 return {name,budget,spent,effectiveDailyBudget:daily,upliftPercent:uplift,expectedByNow,variance:spent-expectedByNow,remaining,remainingPerDay:remainingDays?Math.max(0,remaining)/remainingDays:null,observedDailyPace:pace,constantPaceTotal:pace*totalDays,status,stressDay,stressExceedsRemaining:stressDay===null?null:stressDay>Math.max(0,remaining)+1e-8};
 });
 const sums=key=>rows.reduce((n,r)=>n+r[key],0),budget=sums('budget'),spent=sums('spent');
 return {title,marketplace,timeZone,currency:d.currency,start:d.start,end:d.end,through:d.through,reviewDate:d.reviewDate,spendSource:d.spendSource,totalDays,elapsedDays,remainingDays,notice:NOTICE,assumptions:'Remaining days are after the spend cutoff, not after the review date. Constant pace is not a forecast. Daily illustrations assume sufficient carryover and ignore account/portfolio caps, budget edits and rule interactions.',rule:{source:d.rule.source||'',checked:d.rule.checked||'',validThrough:d.rule.validThrough||'',state:ruleState,explanation:ruleExplanation},totals:{budget,spent,remaining:budget-spent,remainingPerDay:remainingDays?Math.max(0,budget-spent)/remainingDays:null,expectedByNow:sums('expectedByNow'),variance:sums('variance'),constantPaceTotal:sums('constantPaceTotal')},rows};
}
function byteLength(s){return new TextEncoder().encode(s).length;}
function encodeProject(d){analyze(d);const s=JSON.stringify({format:'ad-budget-notebook',version:1,data:d},null,2);if(byteLength(s)>MAX_BYTES)throw Error('Notebook exceeds 500000 UTF-8 bytes');return s;}
function decodeProject(raw){if(typeof raw!=='string'||byteLength(raw)>MAX_BYTES)throw Error('Notebook exceeds 500000 UTF-8 bytes');let p;try{p=JSON.parse(raw)}catch{throw Error('Invalid notebook JSON');}if(!p||p.format!=='ad-budget-notebook'||p.version!==1)throw Error('Unsupported notebook format');analyze(p.data);return p.data;}
function cell(v){if(typeof v==='number'&&Number.isFinite(v))return String(v);let s=String(v??'');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
function reportCSV(r){const lines=[['Ad Budget Notebook',r.title],['Notice',r.notice],['Assumptions',r.assumptions],['Marketplace',r.marketplace,'Currency',r.currency,'Time zone',r.timeZone],['Period',r.start,r.end,'Spend through',r.through,'Review date',r.reviewDate],['Spend basis',r.spendSource],['Rule evidence',r.rule.state,r.rule.source,r.rule.checked,r.rule.validThrough],['Campaign','Planning budget','Spend','Linear allowance through cutoff','Variance (spend - allowance)','Remaining planning budget','Remaining allowance/day','Constant observed-pace total (not forecast)','Effective daily budget','Illustrative uplift %','Illustrative high-spend day (not platform cap)','Status']];
 for(const x of r.rows)lines.push([x.name,x.budget,x.spent,x.expectedByNow,x.variance,x.remaining,x.remainingPerDay,x.constantPaceTotal,x.effectiveDailyBudget,x.upliftPercent,x.stressDay,x.status]);
 return '\uFEFF'+lines.map(l=>l.map(cell).join(',')).join('\r\n');
}
if(typeof module!=='undefined')module.exports={analyze,encodeProject,decodeProject,reportCSV,byteLength};
