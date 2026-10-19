import {defineField, defineType} from 'sanity'

// A slug only has to be unique within its language, so /en/posts/x and /es/posts/x can coexist.
async function isUniqueInLanguage(
  slug: string,
  context: {document?: {_id: string; language?: string}; getClient: (o: {apiVersion: string}) => {fetch: <T>(q: string, p: Record<string, unknown>) => Promise<T>}},
) {
  const {document, getClient} = context
  const id = document?._id.replace(/^drafts\./, '')
  const client = getClient({apiVersion: '2026-10-19'})
  const taken = await client.fetch<boolean>(
    `defined(*[_type == "post" && !(_id in [$draft, $published]) && slug.current == $slug && language == $language][0]._id)`,
    {draft: `drafts.${id}`, published: id, slug, language: document?.language ?? null},
  )
  return !taken
}

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96, isUnique: isUniqueInLanguage},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'Shown on cards and as the article standfirst.',
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text'}),
        defineField({name: 'caption', type: 'string', title: 'Caption'}),
      ],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'featured', type: 'boolean', initialValue: false}),
    defineField({name: 'body', type: 'blockContent'}),
    defineField({name: 'seo', type: 'seo'}),
  ],
  orderings: [
    {
      title: 'Published, newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', author: 'author.name', media: 'mainImage', language: 'language'},
    prepare: ({title, author, media, language}) => ({
      title,
      subtitle: [language?.toUpperCase(), author && `by ${author}`].filter(Boolean).join(' · '),
      media,
    }),
  },
})
