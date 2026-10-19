import {defineArrayMember, defineType} from 'sanity'

/** Light rich text for field-level translated copy (e.g. an author bio). */
export const simpleBlockContent = defineType({
  name: 'simpleBlockContent',
  title: 'Simple Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{name: 'href', type: 'url', title: 'URL'}],
          },
        ],
      },
    }),
  ],
})
