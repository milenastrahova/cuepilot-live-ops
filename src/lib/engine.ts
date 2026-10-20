import type {Show, Incident, Workspace, Cue} from './types.ts'
export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`
export function timeToMinutes(time:string):number { const m=/^(\d{2}):(\d{2})$/.exec(time); if(!m) return NaN; const hours=Number(m[1]),mins=Number(m[2]);return hours<24&&mins<60?hours*60+mins:NaN }
export function fmtDuration(s:number):string { const v=Math.max(0,Math.round(s)); return `${String(Math.floor(v/3600)).padStart(2,'0')}:${String(Math.floor(v%3600/60)).padStart(2,'0')}:${String(v%60).padStart(2,'0')}` }
export function fmtTime(date:string,time:string,offsetSeconds:number):string { const start=timeToMinutes(time);if(!Number.isFinite(start))return '--:--'; const d=new Date(`${date}T00:00:00`); d.setMinutes(start+Math.floor(offsetSeconds/60));return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) }
export const showDuration=(show:Show):number=>show.cues.reduce((t,c)=>t+(Number.isFinite(c.durationSec)?Math.max(0,c.durationSec):0),0)
export function cueTimeline(show:Show):Array<{cue:Cue; offset:number; at:string}> {let offset=0;return show.cues.map(cue=>{const result={cue,offset,at:fmtTime(show.date,show.startTime,offset)};offset+=cue.durationSec;return result})}
export function intervalsOverlap(startA:number,endA:number,startB:number,endB:number):boolean {return startA<endB&&startB<endA}
export function resourceConflicts(show:Show,all:Show[]):Array<{resourceId:string;otherShowId:string}> {
  const start=timeToMinutes(show.startTime); const end=start+showDuration(show)/60
  if(!Number.isFinite(start))return []
  return all.filter(other=>other.id!==show.id&&other.date===show.date&&other.status!=='completed')
    .flatMap(other=>{const otherStart=timeToMinutes(other.startTime);const otherEnd=otherStart+showDuration(other)/60
      return (Number.isFinite(otherStart)&&intervalsOverlap(start,end,otherStart,otherEnd))?show.resourceIds.filter(id=>other.resourceIds.includes(id)).map(resourceId=>({resourceId,otherShowId:other.id})):[]})
}
export function validateCue(cue:Pick<Cue,'title'|'durationSec'>):string[] { const result:string[]=[];if(!cue.title.trim())result.push('Cue title is required');if(!Number.isInteger(cue.durationSec)||cue.durationSec<5||cue.durationSec>14400)result.push('Cue duration must be 5–14400 seconds');return result }
export function unresolvedFor(show:Show,incidents:Incident[]):Incident[]{return incidents.filter(i=>i.showId===show.id&&i.status==='open')}
export function goLiveBlockers(show:Show,ws:Pick<Workspace,'shows'|'resources'|'incidents'>):string[]{
  const problems:string[]=[]
  if(show.status==='completed')problems.push('Completed productions cannot go live')
  if(show.cues.length===0)problems.push('Add at least one cue to the rundown')
  if(show.cues.some(c=>validateCue(c).length>0))problems.push('Fix invalid rundown cues')
  for(const task of show.checklist.filter(x=>x.critical&&!x.done))problems.push(`Critical preflight: ${task.label}`)
  for(const issue of unresolvedFor(show,ws.incidents).filter(i=>i.severity==='critical'))problems.push(`Critical incident: ${issue.title}`)
  for(const id of show.resourceIds){if(ws.resources.find(r=>r.id===id)?.health==='maintenance')problems.push(`Resource under maintenance: ${ws.resources.find(r=>r.id===id)?.name}`)}
  for(const collision of resourceConflicts(show,ws.shows))problems.push(`Double-booked resource: ${ws.resources.find(r=>r.id===collision.resourceId)?.name??collision.resourceId}`)
  return [...new Set(problems)]
}
export function readiness(show:Show, ws:Pick<Workspace,'shows'|'resources'|'incidents'>):{score:number;blockers:string[];completed:number;total:number;label:string}{
 const total=show.checklist.length,completed=show.checklist.filter(c=>c.done).length
 const blockers=goLiveBlockers(show,ws)
 const percent=total?completed/total*100:0
 const penalty=unresolvedFor(show,ws.incidents).filter(i=>i.severity==='high').length*8+resourceConflicts(show,ws.shows).length*15
 const score=Math.max(0,Math.min(100,Math.round(percent-penalty)))
 return {score,blockers,completed,total,label:blockers.length?'Blocked':score===100?'Ready':'In progress'}
}
export function canBookResource(show:Show,id:string,all:Show[]):boolean{return resourceConflicts({...show,resourceIds:[...show.resourceIds,id]},all).every(c=>c.resourceId!==id)}
export function nextCue(show:Show):Cue|undefined{return show.cues.find(c=>c.status==='pending')}
export function activeCue(show:Show):Cue|undefined{return show.cues.find(c=>c.status==='active')}
export function startShow(show:Show):Show { const first=show.cues[0];if(!first)return show;return {...show,status:'live',onHold:false,liveSeconds:0,currentCueId:first.id,cues:show.cues.map((c,i)=>({...c,status:i===0?'active':'pending'}))} }
export function advanceCue(show:Show):Show { if(show.status!=='live'||show.onHold)return show;const current=show.cues.findIndex(c=>c.id===show.currentCueId);if(current<0)return show;const next=show.cues[current+1];return {...show,currentCueId:next?.id??null,status:next?'live':'completed',onHold:false,cues:show.cues.map((c,i)=>({...c,status:i<=current?'completed':i===current+1?'active':c.status}))} }
export function expectedPosition(show:Show):number {const idx=show.cues.findIndex(c=>c.id===show.currentCueId);return idx<0?showDuration(show):show.cues.slice(0,idx).reduce((t,c)=>t+c.durationSec,0)}
export function delaySeconds(show:Show):number {return show.liveSeconds-expectedPosition(show)}
export function upcomingShows(ws:Workspace):Show[]{return [...ws.shows].filter(s=>s.status!=='completed').sort((a,b)=>`${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`))}
export function showCostEstimate(show:Show):number {return Math.round(showDuration(show)/3600*420)}
export function csvCell(value:unknown):string {let str=String(value??''); if(/^[\s]*[=+@\-\t\r]/.test(str))str=`'${str}`; return /[",\n\r]/.test(str)?`"${str.replaceAll('"','""')}"`:str}
export function cueCsv(show:Show):string {const rows=[['Time','Cue','Category','Duration (sec)','Source','Owner','Status','Notes'],...cueTimeline(show).map(x=>[x.at,x.cue.title,x.cue.type,x.cue.durationSec,x.cue.source,x.cue.owner,x.cue.status,x.cue.notes])];return '\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n')}
export function incidentCsv(ws:Workspace):string {const rows=[['Production','Incident','Severity','Status','Created','Resolved','Details'],...ws.incidents.map(i=>[ws.shows.find(s=>s.id===i.showId)?.name??'',i.title,i.severity,i.status,i.createdAt,i.resolvedAt??'',i.detail])];return '\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n')}

function excelCell(value:unknown):string { const str=csvCell(value); return str.includes(';')&&!str.startsWith('"')?`"${str.replaceAll('"','""')}"`:str }
export function cueExcelCsv(show:Show):string { const rows=[['Time','Cue','Category','Duration (sec)','Source','Owner','Status','Notes'],...cueTimeline(show).map(x=>[x.at,x.cue.title,x.cue.type,x.cue.durationSec,x.cue.source,x.cue.owner,x.cue.status,x.cue.notes])];return '\uFEFFsep=;\r\n'+rows.map(r=>r.map(excelCell).join(';')).join('\r\n') }
export function incidentExcelCsv(ws:Workspace):string { const rows=[['Production','Incident','Severity','Status','Created','Resolved','Details'],...ws.incidents.map(i=>[ws.shows.find(s=>s.id===i.showId)?.name??'',i.title,i.severity,i.status,i.createdAt,i.resolvedAt??'',i.detail])];return '\uFEFFsep=;\r\n'+rows.map(r=>r.map(excelCell).join(';')).join('\r\n') }
