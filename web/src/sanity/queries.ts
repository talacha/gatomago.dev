import { defineQuery } from "next-sanity";

const POST_CARD = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  "category": categories[0]->title,
  "readMinutes": round(length(pt::text(body)) / 5 / 200),
  mainImage{ asset, alt, caption, hotspot, crop }
`;

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){ ${POST_CARD} }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    ${POST_CARD},
    _updatedAt,
    body,
    "wordCount": length(string::split(pt::text(body), " ")),
    "categories": categories[]->title,
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description, excerpt, ""),
      "image": coalesce(seo.image, mainImage),
      "noIndex": seo.noIndex == true
    },
    author->{ name, alias, linkedin, image }
  }
`);

export const RELATED_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && slug.current != $slug]
    | order(publishedAt desc)[0...2]{ ${POST_CARD} }
`);

export const AUTHOR_QUERY = defineQuery(`
  *[_type == "author"][0]{ name, alias, linkedin, image, bio }
`);

// Indexable posts only, for sitemap, RSS and llms.txt
export const FEED_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && seo.noIndex != true] | order(publishedAt desc){
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    _updatedAt,
    "text": pt::text(body),
    "category": categories[0]->title,
    "authorName": author->name
  }
`);
