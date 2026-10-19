/**
 * Creates (or updates) the publish webhook that refreshes the site and announces new posts.
 * Usage: WEBHOOK_URL=https://www.gatomago.dev/api/webhooks/sanity WEBHOOK_SECRET=... \
 *        npx sanity exec scripts/create-webhook.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'})
const {projectId, dataset, token} = client.config()
const url = process.env.WEBHOOK_URL
const secret = process.env.WEBHOOK_SECRET
if (!url || !secret) throw new Error('Set WEBHOOK_URL and WEBHOOK_SECRET')

const base = `https://api.sanity.io/v2025-02-19/hooks/projects/${projectId}`
const headers = {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}
const NAME = 'Gato Mago: refresh site + announce post'

const body = {
  name: NAME,
  url,
  dataset,
  httpMethod: 'POST',
  apiVersion: 'v2025-02-19',
  includeDrafts: false,
  secret,
  isDisabledByUser: false,
  type: 'document',
  includeAllVersions: false,
  rule: {
    on: ['create', 'update'],
    filter: '_type == "post" && defined(slug.current)',
    projection: '{_id, _type}',
  },
}

async function main() {
  const existing: {id: string; name: string}[] = await (await fetch(base, {headers})).json()
  const match = existing.find((h) => h.name === NAME)
  const res = await fetch(match ? `${base}/${match.id}` : base, {
    method: match ? 'PUT' : 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const out = await res.json()
  console.log(match ? 'updated' : 'created', res.status, JSON.stringify(res.ok ? {id: out.id, url: out.url, isDisabled: out.isDisabledByUser ?? out.isDisabled, dataset: out.dataset} : out))
  if (!res.ok) process.exit(1)
}
main()
