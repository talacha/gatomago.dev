import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'alias', type: 'string', description: 'Pen name, e.g. Gato Mago'}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'bio',
      type: 'array',
      of: [defineField({name: 'block', type: 'block'})],
    }),
    defineField({name: 'linkedin', type: 'url', title: 'LinkedIn URL'}),
  ],
  preview: {select: {title: 'name', subtitle: 'alias', media: 'image'}},
})
