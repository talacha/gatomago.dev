import {defineConfig, type Template} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'

// Languages live in Sanity as `locale` documents so editors can add one without a code change.
const supportedLanguages = (client: {fetch: <T>(q: string) => Promise<T>}) =>
  client.fetch<{id: string; title: string}[]>(
    `*[_type == "locale"] | order(default desc, name asc){"id": tag, "title": name}`,
  )

const LOCALIZED_TYPES = ['post']
const BASE_LANGUAGE = 'en'

export default defineConfig({
  name: 'default',
  title: 'Gato Mago',

  projectId: 'epnbx6w4',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    codeInput(),
    // Document-level: each language of a post is its own document, linked by translation.metadata.
    documentInternationalization({
      supportedLanguages,
      schemaTypes: LOCALIZED_TYPES,
      languageField: 'language',
    }),
    // Field-level: shared documents (author bio, category titles) hold a value per language.
    internationalizedArray({
      languages: supportedLanguages,
      defaultLanguages: [BASE_LANGUAGE],
      fieldTypes: ['string', 'text', 'simpleBlockContent'],
    }),
  ],

  document: {
    // New posts start in the base language; translations are made from the post itself.
    newDocumentOptions: (prev) => [
      ...prev.filter((item) => !LOCALIZED_TYPES.includes(item.templateId)),
      ...LOCALIZED_TYPES.map((schemaType) => ({
        templateId: `${schemaType}-${BASE_LANGUAGE}`,
        parameters: {language: BASE_LANGUAGE},
      })),
    ],
  },

  schema: {
    types: schemaTypes,
    templates: (prev): Template[] => [
      ...prev,
      ...LOCALIZED_TYPES.map((schemaType) => ({
        id: `${schemaType}-${BASE_LANGUAGE}`,
        title: `${schemaType[0].toUpperCase()}${schemaType.slice(1)} (${BASE_LANGUAGE.toUpperCase()})`,
        schemaType,
        parameters: [{name: 'language', type: 'string'}],
        value: ({language}: {language: string}) => ({language}),
      })),
    ],
  },
})
