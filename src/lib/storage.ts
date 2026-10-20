import type {Workspace} from './types.ts'
import {seedWorkspace} from './seed.ts'
const KEY='cuepilot.workspace.v1'
const record=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x)
const str=(x:unknown):x is string=>typeof x==='string'
const array=(x:unknown):x is unknown[]=>Array.isArray(x)
const status=(x:unknown,options:string[]):boolean=>str(x)&&options.includes(x)
function isCue(x:unknown):boolean {return record(x)&&str(x.id)&&str(x.title)&&str(x.type)&&str(x.source)&&str(x.owner)&&str(x.notes)&&typeof x.durationSec==='number'&&Number.isFinite(x.durationSec)&&status(x.status,['pending','active','completed','skipped'])}
function isCheck(x:unknown):boolean{return record(x)&&str(x.id)&&str(x.label)&&str(x.category)&&typeof x.critical==='boolean'&&typeof x.done==='boolean'}
function isShow(x:unknown):boolean{return record(x)&&[x.id,x.name,x.competition,x.venue,x.channel,x.date,x.startTime,x.producer,x.cover].every(str)&&status(x.status,['scheduled','rehearsal','live','completed'])&&array(x.cues)&&x.cues.length<=250&&x.cues.every(isCue)&&array(x.checklist)&&x.checklist.length<=150&&x.checklist.every(isCheck)&&array(x.resourceIds)&&x.resourceIds.every(str)&&(x.currentCueId===null||str(x.currentCueId))&&typeof x.liveSeconds==='number'&&Number.isFinite(x.liveSeconds)&&typeof x.onHold==='boolean'&&array(x.log)&&x.log.length<=100&&x.log.every(l=>record(l)&&str(l.id)&&str(l.at)&&str(l.message))}
function isResource(x:unknown):boolean{return record(x)&&[x.id,x.name,x.type,x.detail].every(str)&&status(x.health,['ready','maintenance'])}
function isIncident(x:unknown):boolean{return record(x)&&[x.id,x.showId,x.title,x.createdAt,x.detail].every(str)&&status(x.severity,['low','medium','high','critical'])&&status(x.status,['open','resolved'])&&(x.resolvedAt===undefined||str(x.resolvedAt))}
export function isWorkspace(x:unknown):x is Workspace {if(!record(x))return false;return x.version===1&&str(x.selectedShowId)&&array(x.shows)&&x.shows.length>0&&x.shows.length<=50&&x.shows.every(isShow)&&x.shows.some(s=>record(s)&&s.id===x.selectedShowId)&&array(x.resources)&&x.resources.length<=200&&x.resources.every(isResource)&&array(x.incidents)&&x.incidents.length<=500&&x.incidents.every(isIncident)}
export function loadWorkspace():Workspace{try{const raw=localStorage.getItem(KEY);if(raw&&raw.length<3000000){const ws:unknown=JSON.parse(raw);if(isWorkspace(ws))return ws}}catch{/* use seeded demo */}return seedWorkspace()}
export function saveWorkspace(ws:Workspace){try{localStorage.setItem(KEY,JSON.stringify(ws))}catch{/* storage unavailable */}}
export function safeImport(raw:string):Workspace {if(raw.length>3000000)throw Error('Backup too large (3 MB maximum)');const value:unknown=JSON.parse(raw);if(!isWorkspace(value))throw Error('Invalid CuePilot workspace backup');return value}
