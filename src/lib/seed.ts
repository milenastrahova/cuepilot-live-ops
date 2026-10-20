import type {Workspace,Show,Check,Cue} from './types.ts'
function localDate(daysAhead:number):string {const d=new Date();d.setDate(d.getDate()+daysAhead);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
const checkLabels:[string,string,boolean][]=[
 ['Camera feeds verified','Video',true],['Audio levels & comms tested','Audio',true],['Primary encoder connected','Transmission',true],['Backup stream armed','Transmission',true],['Graphics package loaded','Graphics',false],['Lineup & talkback briefing','Crew',false],['Rights clearance confirmed','Compliance',true],['Emergency contact sheet shared','Operations',false]
]
function checklist(missing:string[]=[]):Check[]{return checkLabels.map(([label,category,critical],i)=>({id:`check-${i}`,label,category,critical,done:!missing.includes(label)}))}
function cue(id:string,title:string,type:string,min:number,source:string,owner:string):Cue{return {id,title,type,durationSec:min*60,source,owner,notes:'',status:'pending'}}
const mkShow=(overrides:Pick<Show,'id'|'name'|'competition'|'venue'|'channel'|'date'|'startTime'|'producer'|'status'|'cover'|'resourceIds'|'cues'|'checklist'>):Show=>({...overrides,currentCueId:null,liveSeconds:0,onHold:false,log:[]})
export function seedWorkspace():Workspace {
const shows:Show[]=[
 mkShow({id:'show-1',name:'Riga Wolves vs. Tallinn Titans',competition:'BALTIC BASKETBALL LEAGUE',venue:'Arena Riga · Court 1',channel:'STREAM / MAIN',date:localDate(0),startTime:'19:30',producer:'Alex Morgan',status:'rehearsal',cover:'basketball',resourceIds:['cam1','cam2','audio1','enc1','gfx1','studio1'],checklist:checklist(),cues:[
 cue('c1','Transmission open / Bars','Technical',2,'TX 01','Mia'),cue('c2','Opening titles & sponsor slate','Graphics',1,'GFX A','Eva'),cue('c3','Host welcome & team lineups','Studio',6,'CAM 1','Alex'),cue('c4','First quarter — game feed','Game',18,'PGM','Alex'),cue('c5','Quarter break analysis','Studio',5,'CAM 2','Mia'),cue('c6','Second quarter','Game',18,'PGM','Alex'),cue('c7','Half-time desk & highlights','Studio',12,'CAM 1','Eva'),cue('c8','Third quarter','Game',18,'PGM','Alex'),cue('c9','Fourth quarter','Game',18,'PGM','Alex'),cue('c10','Post-game interviews','Interview',8,'CAM 2','Mia'),cue('c11','Closing titles / TX end','Graphics',2,'GFX A','Eva')] }),
 mkShow({id:'show-2',name:'Northern Cup · Final',competition:'FOOTBALL / CHAMPIONSHIP',venue:'Daugava Stadium · Main pitch',channel:'STREAM / SPORT',date:localDate(1),startTime:'17:00',producer:'Daniel Brooks',status:'scheduled',cover:'football',resourceIds:['cam3','cam4','audio2','enc2','gfx2','van1'],checklist:checklist(['Backup stream armed','Graphics package loaded','Emergency contact sheet shared']),cues:[
 cue('f1','Signal test & pre-show slate','Technical',3,'TX 02','Chris'),cue('f2','Opening montage','Graphics',2,'GFX B','Eva'),cue('f3','Commentary welcome','Studio',6,'CAM 3','Daniel'),cue('f4','First half','Game',45,'PGM','Daniel'),cue('f5','Half-time report','Studio',15,'CAM 4','Chris'),cue('f6','Second half','Game',45,'PGM','Daniel'),cue('f7','Trophy ceremony','Game',12,'CAM 3','Daniel'),cue('f8','Credits / Sign off','Graphics',3,'GFX B','Eva')] }),
 mkShow({id:'show-3',name:'Inside the Game · Weekly Recap',competition:'SPORTS STUDIO / EDITORIAL',venue:'Northstar Studio · Stage B',channel:'STREAM / YOUTUBE',date:localDate(3),startTime:'14:00',producer:'Olivia Hart',status:'scheduled',cover:'studio',resourceIds:['cam1','audio1','enc1','gfx1','studio1'],checklist:checklist(['Camera feeds verified','Audio levels & comms tested','Primary encoder connected','Backup stream armed','Graphics package loaded','Lineup & talkback briefing','Rights clearance confirmed','Emergency contact sheet shared']),cues:[
 cue('r1','Cold open & teaser','Graphics',2,'GFX A','Eva'),cue('r2','Host introduction','Studio',5,'CAM 1','Olivia'),cue('r3','Top moments reel','VT',9,'VT 01','Chris'),cue('r4','Tactical breakdown','Studio',13,'CAM 2','Olivia'),cue('r5','Audience questions','Studio',8,'CAM 1','Olivia'),cue('r6','Sign off','Graphics',3,'GFX A','Eva')] })]
return {version:1,selectedShowId:'show-1',shows,resources:[
{id:'cam1',name:'Sony FX9 · A01',type:'Camera',detail:'4K cinema camera',health:'ready'},
{id:'cam2',name:'Sony FX9 · A02',type:'Camera',detail:'4K cinema camera',health:'ready'},
{id:'cam3',name:'Grass Valley · C03',type:'Camera',detail:'Live stadium camera',health:'ready'},
{id:'cam4',name:'Grass Valley · C04',type:'Camera',detail:'Live stadium camera',health:'ready'},
{id:'audio1',name:'Yamaha QL5 · Mix A',type:'Audio',detail:'Digital audio console',health:'ready'},
{id:'audio2',name:'Allen & Heath SQ7',type:'Audio',detail:'Stadium audio desk',health:'ready'},
{id:'enc1',name:'Haivision Makito X4',type:'Encoder',detail:'Primary stream encoder',health:'ready'},
{id:'enc2',name:'LiveU LU800',type:'Encoder',detail:'Field bonded encoder',health:'ready'},
{id:'gfx1',name:'Viz Trio · Graphics A',type:'Graphics',detail:'Realtime graphics',health:'ready'},
{id:'gfx2',name:'Viz Trio · Graphics B',type:'Graphics',detail:'Realtime graphics',health:'ready'},
{id:'studio1',name:'Studio A · Control Room',type:'Studio',detail:'Main production control',health:'ready'},
{id:'van1',name:'OB Van · Unit 03',type:'Transport',detail:'Outside broadcast unit',health:'ready'}],incidents:[
{id:'incident-1',showId:'show-2',title:'Secondary return audio intermittently drops',severity:'high',status:'open',createdAt:new Date().toISOString(),detail:'Stadium comms return path needs verification before kick-off.'},
{id:'incident-2',showId:'show-1',title:'Camera 2 tally light reset',severity:'low',status:'resolved',createdAt:new Date(Date.now()-86400000).toISOString(),resolvedAt:new Date().toISOString(),detail:'Reset and verified during technical rehearsal.'}
]}
}
