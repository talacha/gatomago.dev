import {TranslateIcon} from '@sanity/icons/Translate'
import {defineField, defineType} from 'sanity'

/** Languages the site publishes in. The Studio plugins and (by convention) the web app read these tags. */
export const locale = defineType({
  name: 'locale',
  title: 'Locale',
  type: 'document',
  icon: TranslateIcon,
  fields: [
    defineField({name: 'name', type: 'string', description: 'Native name, e.g. Español', validation: (rule) => rule.required()}),
    defineField({
      name: 'tag',
      type: 'string',
      description: 'IETF language tag used in URLs and hreflang, e.g. en, es',
      validation: (rule) => rule.required().regex(/^[a-z]{2,3}(-[A-Za-z0-9]+)*$/, {name: 'language tag'}),
    }),
    defineField({name: 'default', type: 'boolean', description: 'The language used when no other is chosen.', initialValue: false}),
  ],
  preview: {select: {title: 'name', subtitle: 'tag'}},
})
