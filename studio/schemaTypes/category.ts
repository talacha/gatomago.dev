import {defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      description: 'Translated per language. The English value is the fallback.',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: (doc) => (doc.title as {_key: string; value?: string}[] | undefined)?.find((t) => t._key === 'en')?.value ?? ''},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', type: 'internationalizedArrayText'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({
      title: (title as {_key: string; value?: string}[] | undefined)?.find((t) => t._key === 'en')?.value ?? 'Untitled category',
    }),
  },
})
