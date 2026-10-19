/**
 * Idempotent: seeds locales, tags existing posts as English, converts the author bio to
 * per-language values, and adds linked Spanish sample posts.
 *
 * Run from studio/: npx sanity exec scripts/seed-i18n.ts --with-user-token
 */
import {randomUUID} from 'node:crypto'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'})

const block = (text: string, style = 'normal') => {
  const key = randomUUID().slice(0, 8)
  return {_type: 'block', _key: key, style, markDefs: [], children: [{_type: 'span', _key: `${key}s`, text, marks: []}]}
}

async function main() {
  // 1. Locales
  await client
    .transaction()
    .createIfNotExists({_id: 'locale-en', _type: 'locale', name: 'English', tag: 'en', default: true})
    .createIfNotExists({_id: 'locale-es', _type: 'locale', name: 'Español', tag: 'es', default: false})
    .commit()
  console.log('locales ok')

  // 2. Existing posts without a language are English
  const untagged = await client.fetch<{_id: string}[]>(`*[_type == "post" && !defined(language)]{_id}`)
  for (const {_id} of untagged) await client.patch(_id).set({language: 'en'}).commit()
  console.log(`tagged ${untagged.length} posts as en`)

  // 3. Author bio -> per-language values
  const authors = await client.fetch<{_id: string; bio?: {_type: string; _key: string}[]}[]>(`*[_type == "author" && !(_id in path("drafts.**"))]{_id, bio}`)
  for (const a of authors) {
    const alreadyLocalized = a.bio?.[0] && a.bio[0]._type !== 'block'
    if (alreadyLocalized) continue
    await client
      .patch(a._id)
      .set({
        bio: [
          {_key: 'en', _type: 'internationalizedArraySimpleBlockContentValue', value: [block('Essays, charms and field notes from the candlelit study.')]},
          {_key: 'es', _type: 'internationalizedArraySimpleBlockContentValue', value: [block('Ensayos, hechizos y notas de campo desde el estudio a la luz de las velas.')]},
        ],
      })
      .commit()
  }
  console.log(`bio localized for ${authors.length} author(s)`)

  // 4. Spanish sample posts, linked to their English originals
  const spanish = [
    {
      enSlug: 'lorem-ipsum-dolor-sit-amet',
      title: 'Lorem ipsum: texto de ejemplo en español',
      slug: 'lorem-ipsum-texto-de-ejemplo',
      excerpt: 'Un texto de relleno en español para probar la traducción de entradas, con su enlace al original en inglés.',
      body: [
        block('Este es un párrafo de ejemplo para comprobar cómo se muestra una entrada en español. Cuando publiques contenido real, reemplaza este texto desde el Studio.'),
        block('Un subtítulo de ejemplo', 'h2'),
        block('Cada idioma es un documento independiente, de modo que puedes publicar la versión en español cuando esté lista, sin esperar a la inglesa.'),
        block('Una buena pregunta, mantenida cerca, termina por responderse sola.', 'blockquote'),
      ],
    },
    {
      enSlug: 'sed-ut-perspiciatis-unde-omnis',
      title: 'Sed ut perspiciatis: segunda entrada de ejemplo',
      slug: 'sed-ut-perspiciatis-segunda-entrada',
      excerpt: 'Segunda entrada de relleno en español, enlazada con su versión en inglés.',
      body: [
        block('Otro párrafo de ejemplo en español. Sirve para ver el diseño de la página, la tipografía y el selector de idioma.'),
        block('Otro subtítulo de ejemplo', 'h2'),
        block('Las traducciones se enlazan entre sí, así el sitio puede ofrecer el cambio de idioma y las etiquetas hreflang para buscadores.'),
      ],
    },
  ]

  for (const es of spanish) {
    const exists = await client.fetch<boolean>(`defined(*[_type == "post" && language == "es" && slug.current == $slug][0]._id)`, {slug: es.slug})
    if (exists) continue
    const en = await client.fetch<{_id: string; author?: {_ref: string}; publishedAt?: string} | null>(
      `*[_type == "post" && language == "en" && slug.current == $slug && !(_id in path("drafts.**"))][0]{_id, author, publishedAt}`,
      {slug: es.enSlug},
    )
    if (!en) {
      console.log(`skip ${es.slug}: no English post ${es.enSlug}`)
      continue
    }
    const esId = randomUUID()
    const ref = (id: string) => ({_type: 'reference', _ref: id, _weak: true, _strengthenOnPublish: {type: 'post'}})
    await client
      .transaction()
      .create({
        _id: esId,
        _type: 'post',
        language: 'es',
        title: es.title,
        slug: {_type: 'slug', current: es.slug},
        excerpt: es.excerpt,
        author: en.author,
        publishedAt: en.publishedAt,
        featured: false,
        body: es.body,
      })
      .create({
        _id: randomUUID(),
        _type: 'translation.metadata',
        schemaTypes: ['post'],
        translations: [
          {_key: 'en', _type: 'internationalizedArrayReferenceValue', value: ref(en._id)},
          {_key: 'es', _type: 'internationalizedArrayReferenceValue', value: ref(esId)},
        ],
      })
      .commit()
    console.log(`created ${es.slug} linked to ${es.enSlug}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
