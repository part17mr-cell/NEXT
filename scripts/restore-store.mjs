// Restores a backup JSON into Upstash Redis using the same chunked format the
// app uses. Run: node scripts/restore-store.mjs [path-to-backup.json]
// Connects to whatever Upstash is configured in .env.local (point it at the NEW
// database to migrate data to a fresh account).
import { Redis } from '@upstash/redis'
import fs from 'fs'
import path from 'path'

function envVal(key) {
  const txt = fs.readFileSync('.env.local', 'utf8')
  const m = txt.match(new RegExp('^' + key + '=(.*)$', 'm'))
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined
}

const url = envVal('UPSTASH_REDIS_REST_URL')
const token = envVal('UPSTASH_REDIS_REST_TOKEN')
if (!url || !token) { console.error('Missing Upstash credentials in .env.local'); process.exit(1) }

// pick file: arg, or newest in backup/
let file = process.argv[2]
if (!file) {
  const dir = 'backup'
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort() : []
  if (!files.length) { console.error('No backup file found. Pass a path or run backup first.'); process.exit(1) }
  file = path.join(dir, files[files.length - 1])
}

const data = JSON.parse(fs.readFileSync(file, 'utf8'))
const redis = new Redis({ url, token })

const serialized = JSON.stringify(data)
const CHUNK_CHARS = 500_000
const chunks = []
for (let i = 0; i < serialized.length; i += CHUNK_CHARS) chunks.push(serialized.slice(i, i + CHUNK_CHARS))
if (chunks.length === 0) chunks.push('{}')

const gen = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
for (let i = 0; i < chunks.length; i++) await redis.set(`nextthon:store:${gen}:${i}`, chunks[i])
await redis.set('nextthon:store:meta', { n: chunks.length, gen })

console.log('RESTORE_OK from', file, '->', chunks.length, 'chunks,', Math.round(Buffer.byteLength(serialized) / 1024), 'KB')
