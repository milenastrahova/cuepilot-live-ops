import test from 'node:test'
import assert from 'node:assert/strict'
import {isWorkspace,safeImport} from '../src/lib/storage.ts'
import {seedWorkspace} from '../src/lib/seed.ts'

test('seed dataset validates',()=>assert.equal(isWorkspace(seedWorkspace()),true))
test('backup roundtrip',()=>{const ws=seedWorkspace();const result=safeImport(JSON.stringify(ws));assert.equal(result.shows.length,3)})
test('bad backup fails structurally',()=>assert.throws(()=>safeImport('{"hello":true}'),/Invalid/))
test('invalid nested cue fails structurally',()=>{const ws=seedWorkspace();ws.shows[0].cues[0].durationSec='bad';assert.equal(isWorkspace(ws),false)})
test('empty productions cannot be imported',()=>{const ws=seedWorkspace();ws.shows=[];assert.equal(isWorkspace(ws),false)})
test('rejects large backups',()=>assert.throws(()=>safeImport(' '.repeat(3000001)),/too large/))
