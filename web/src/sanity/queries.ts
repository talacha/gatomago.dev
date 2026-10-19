import { defineQuery } from "next-sanity";

// Field-level translated values fall back to English when a language is missing.
// (Plain string constants rather than a helper so TypeGen can evaluate the queries.)
const CATEGORY_TITLE = `coalesce(categories[0]->title[_key == $lang][0].value, categories[0]->title[_key == "en"][0].value)`;
const CATEGORY_TITLE_EACH = `coalesce(title[_key == $lang][0].value, title[_key == "en"][0].value)`;
const BIO = `coalesce(bio[_key == $lang][0].value, bio[_key == "en"][0].value)`;

const POST_CARD = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  "category": ${CATEGORY_TITLE},
  "readMinutes": round(length(pt::text(body)) / 5 / 200),
  mainImage{ asset, alt, caption, hotspot, crop }
`;

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && language == $lang && defined(slug.current)] | order(publishedAt desc){ ${POST_CARD} }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(language) && defined(slug.current)]{ "lang": language, "slug": slug.current }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && language == $lang && slug.current == $slug][0]{
    ${POST_CARD},
    _updatedAt,
    body,
    "wordCount": length(string::split(pt::text(body), " ")),
    "categories": categories[]->{ "title": ${CATEGORY_TITLE_EACH} }.title,
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description, excerpt, ""),
      "image": coalesce(seo.image, mainImage),
      "noIndex": seo.noIndex == true
    },
    "translations": (*[_type == "translation.metadata" && references(^._id)][0].translations[].value->{
      "lang": language,
      "slug": slug.current
    })[defined(slug) && lang != $lang],
    author->{ name, alias, linkedin, image }
  }
`);

export const RELATED_POSTS_QUERY = defineQuery(`
  *[_type == "post" && language == $lang && defined(slug.current) && slug.current != $slug]
    | order(publishedAt desc)[0...2]{ ${POST_CARD} }
`);

export const AUTHOR_QUERY = defineQuery(`
  *[_type == "author"][0]{
    name,
    alias,
    linkedin,
    image,
    "bio": ${BIO}
  }
`);

// Indexable posts in every language, with the translations each links to.
// Used by the sitemap, RSS feeds and llms.txt.
export const FEED_QUERY = defineQuery(`
  *[_type == "post" && defined(language) && defined(slug.current) && seo.noIndex != true]
    | order(publishedAt desc){
    _id,
    title,
    "lang": language,
    "slug": slug.current,
    excerpt,
    publishedAt,
    _updatedAt,
    "text": pt::text(body),
    "categoryTitles": categories[0]->title[]{ _key, value },
    "authorName": author->name,
    "translations": (*[_type == "translation.metadata" && references(^._id)][0].translations[].value->{
      "lang": language,
      "slug": slug.current
    })[defined(slug)]
  }
`);
