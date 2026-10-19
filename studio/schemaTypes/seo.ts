import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  description: 'Optional overrides. Leave blank to use the post title, excerpt and main image.',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Overrides the page title. Aim for under 60 characters.',
      validation: (rule) => rule.max(70).warning('Titles over ~60 characters may be truncated.'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Search and social summary. Aim for 120-160 characters.',
      validation: (rule) =>
        rule.max(170).warning('Descriptions over ~160 characters may be truncated.'),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      description: 'Social sharing image, 1200x630 recommended.',
    }),
    defineField({
      name: 'noIndex',
      type: 'boolean',
      description: 'Hide this post from search engines and the sitemap.',
      initialValue: false,
    }),
  ],
})
