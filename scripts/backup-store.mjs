// Backs up the entire store (settings, products, orders, members, promo, reviews)
// from Upstash Redis to a local JSON file. Run: node scripts/backup-store.mjs
import { Redis } from '@upstash/redis'
import fs from 'fs'

function envVal(key) {
  const txt = fs.readFileSync('.env.local', 'utf8')
  const m = txt.match(new RegExp('^' + key + '=(.*)$', 'm'))
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined
}

const url = envVal('UPSTASH_REDIS_REST_URL')
const token = envVal('UPSTASH_REDIS_REST_TOKEN')
if (!url || !token) {
  console.error('Missing Upstash credentials in .env.local')
  process.exit(1)
}

const redis = new Redis({ url, token })
const META = 'nextthon:store:meta'
const LEGACY = 'nextthon:store'

const meta = await redis.get(META)
let store
if (meta && meta.n && meta.gen) {
  let s = ''
  for (let i = 0; i < meta.n; i++) {
    const part = await redis.get(`nextthon:store:${meta.gen}:${i}`)
    if (part == null) { console.error('Missing chunk', i, '- backup aborted'); process.exit(1) }
    s += part
  }
  store = JSON.parse(s)
} else {
  store = (await redis.get(LEGACY)) || {}
}

fs.mkdirSync('backup', { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const file = `backup/store-backup-${stamp}.json`
const json = JSON.stringify(store)
fs.writeFileSync(file, json)

const counts = {
  file,
  sizeKB: Math.round(Buffer.byteLength(json) / 1024),
  products: store.products?.length ?? 0,
  orders: store.orders?.length ?? 0,
  members: store.members?.length ?? 0,
  promoCodes: store.promoCodes?.length ?? 0,
  reviews: store.reviews?.length ?? 0,
  hasSettings: !!store.settings,
}
console.log('BACKUP_OK')
console.log(JSON.stringify(counts, null, 2))
