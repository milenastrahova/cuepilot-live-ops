import test from 'node:test'
import assert from 'node:assert/strict'
import {seedWorkspace} from '../src/lib/seed.ts'
import {cueTimeline,showDuration,fmtDuration,timeToMinutes,fmtTime,resourceConflicts,canBookResource,readiness,goLiveBlockers,validateCue,startShow,advanceCue,expectedPosition,delaySeconds,csvCell,cueCsv,incidentCsv,cueExcelCsv,incidentExcelCsv,intervalsOverlap,showCostEstimate,activeCue,nextCue} from '../src/lib/engine.ts'
const ws=seedWorkspace();const [a,b,c]=ws.shows

test('seed generates three editorial productions',()=>assert.equal(ws.shows.length,3))
test('planned rundown duration sums all cue durations',()=>assert.equal(showDuration(a),a.cues.reduce((t,c)=>t+c.durationSec,0)))
test('cue timeline positions are sequential',()=>{const timeline=cueTimeline(a);assert.equal(timeline[0].offset,0);assert.equal(timeline[1].offset,a.cues[0].durationSec)})
test('time formatting handles hour rollovers',()=>{assert.equal(fmtDuration(3661),'01:01:01');assert.equal(timeToMinutes('23:50'),1430);assert.equal(timeToMinutes('99:45'),NaN);assert.equal(fmtTime('2026-10-20','23:50',1200),'00:10')})
test('interval endpoint touching is not an overlap',()=>{assert.equal(intervalsOverlap(0,60,60,120),false);assert.equal(intervalsOverlap(0,61,60,120),true)})
test('non-overlapping shows can share production resources',()=>assert.equal(resourceConflicts(a,ws.shows).length,0))
test('double booking detected on overlapping productions',()=>{const copy={...b,id:'overlap',date:a.date,startTime:a.startTime,resourceIds:['cam1']};assert.equal(resourceConflicts(copy,ws.shows).length,1)})
test('booking checker rejects collisions and accepts safe resources',()=>{const copy={...b,date:a.date,startTime:a.startTime};assert.equal(canBookResource(copy,'cam1',ws.shows),false);assert.equal(canBookResource(copy,'cam4',ws.shows),true)})
test('ready production may go live',()=>{assert.deepEqual(goLiveBlockers(a,ws),[]);assert.equal(readiness(a,ws).score,100)})
test('missing critical preflight check blocks go-live',()=>assert.ok(goLiveBlockers(b,ws).some(p=>p.includes('Backup stream'))))
test('maintenance resource blocks go-live',()=>{const resources=ws.resources.map(r=>r.id==='cam1'?{...r,health:'maintenance'}:r);assert.ok(goLiveBlockers(a,{...ws,resources}).some(x=>x.includes('maintenance')))})
test('critical incidents block go-live',()=>{const incidents=[...ws.incidents,{...ws.incidents[0],showId:a.id,severity:'critical'}];assert.ok(goLiveBlockers(a,{...ws,incidents}).some(x=>x.includes('Critical incident')))})
test('validate invalid cue duration & empty title',()=>assert.equal(validateCue({title:' ',durationSec:0}).length,2))
test('starting & advancing keeps single active cue',()=>{const start=startShow(a);assert.equal(start.status,'live');assert.equal(activeCue(start)?.id,a.cues[0].id);assert.equal(nextCue(start)?.id,a.cues[1].id);const advanced=advanceCue(start);assert.equal(activeCue(advanced)?.id,a.cues[1].id);assert.equal(advanced.cues[0].status,'completed')})
test('hold prevents cue advance',()=>{const start=startShow(a);const hold={...start,onHold:true};assert.equal(advanceCue(hold).currentCueId,start.currentCueId)})
test('end of rundown completes show',()=>{let s=startShow(a);for(let i=0;i<a.cues.length;i++)s=advanceCue(s);assert.equal(s.status,'completed');assert.equal(s.currentCueId,null)})
test('delay compares elapsed against planned cue start',()=>{const s=advanceCue(startShow(a));assert.equal(expectedPosition(s),a.cues[0].durationSec);assert.equal(delaySeconds({...s,liveSeconds:a.cues[0].durationSec+30}),30)})
test('CSV encodes quotes, commas, and formula injection safely',()=>{assert.equal(csvCell('a,b'),'"a,b"');assert.equal(csvCell('a"b'),'"a""b"');assert.equal(csvCell('=HYPERLINK(1)'),"'=HYPERLINK(1)")})
test('rundown CSV is generated with BOM and rows',()=>{const csv=cueCsv(a);assert.ok(csv.startsWith('\uFEFFTime,Cue'));assert.equal(csv.split('\r\n').length,a.cues.length+1)})
test('incident CSV includes all incident rows',()=>assert.equal(incidentCsv(ws).split('\r\n').length,ws.incidents.length+1))
test('cost estimate based on program length',()=>assert.equal(showCostEstimate(a),Math.round(showDuration(a)/3600*420)))
test('unfinished preflight yields reduced readiness',()=>assert.ok(readiness(c,ws).score<50))

test('Excel exports use semicolon with sep directive',()=>{assert.ok(cueExcelCsv(a).startsWith('\uFEFFsep=;\r\nTime;Cue'));assert.ok(incidentExcelCsv(ws).includes(';Severity;Status;'))})
