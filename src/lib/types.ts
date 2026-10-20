export type ShowStatus = 'scheduled' | 'rehearsal' | 'live' | 'completed'
export type CueStatus = 'pending' | 'active' | 'completed' | 'skipped'
export type Severity = 'low' | 'medium' | 'high' | 'critical'
export type ResourceType = 'Camera' | 'Audio' | 'Encoder' | 'Studio' | 'Graphics' | 'Transport'
export type Section = 'dashboard' | 'rundown' | 'live' | 'resources' | 'readiness' | 'incidents' | 'reports'
export interface Cue { id:string; title:string; type:string; durationSec:number; source:string; owner:string; notes:string; status:CueStatus; }
export interface Check { id:string; label:string; category:string; critical:boolean; done:boolean }
export interface Incident { id:string; showId:string; title:string; severity:Severity; status:'open'|'resolved'; createdAt:string; resolvedAt?:string; detail:string }
export interface Resource { id:string; name:string; type:ResourceType; detail:string; health:'ready'|'maintenance'; }
export interface Show {
  id:string; name:string; competition:string; venue:string; channel:string; date:string; startTime:string; producer:string;
  status:ShowStatus; cover:string; cues:Cue[]; checklist:Check[]; resourceIds:string[];
  currentCueId:string|null; liveSeconds:number; onHold:boolean; log:Array<{id:string; at:string; message:string}>;
}
export interface Workspace {version:1; shows:Show[]; resources:Resource[]; incidents:Incident[]; selectedShowId:string}
