import type { Locale } from "./config";

const en = {
  meta: {
    title: "Gato Mago: Essays, charms and field notes",
    homeTitle: "Gato Mago: Essays, charms and field notes by Juan Luis Villaseñor",
    description:
      "Essays, charms and field notes by Juan Luis Villaseñor, known as Gato Mago: a candlelit study of magic, craft and curiosity.",
    ogAlt: "Gato Mago: Discover the magic. A wizard cat in a patched hat holds a glowing orb.",
  },
  a11y: { skip: "Skip to content", mainNav: "Main", footerNav: "Footer", home: "Gato Mago, home", language: "Language" },
  nav: { grimoire: "Grimoire", about: "About", circle: "Join the Circle" },
  hero: {
    titleLead: "Dispatches from the",
    titleEm: "candlelit study",
    sub: "Essays, charms and field notes by Juan Luis Villaseñor, known in these halls as Gato Mago. Read by candlelight; no broomstick required.",
    cta: "Read the latest",
    imageAlt:
      "Gato Mago, a grey cat in a patched wizard hat, holding a glowing crystal orb in a candlelit library",
  },
  featured: { label: "Freshly Inscribed", cta: "Read the entry →" },
  grimoire: {
    title: "From the Grimoire",
    empty: "The grimoire is still being inscribed. Return soon.",
    more: "More entries are on their way.",
  },
  about: {
    heading: "Behind the hat:",
    fallbackBio: "Essays, charms and field notes from the candlelit study.",
    linkedin: "LinkedIn →",
    portraitAlt: "Close portrait of Gato Mago, the grey cat in a wizard hat",
  },
  newsletter: {
    title: "Join the Circle",
    text: "One letter when a new entry lands. No spam, no spells cast on your inbox.",
    label: "Email address",
    placeholder: "your@email.com",
    submit: "Subscribe",
    pending: "Letters aren't flying just yet. Follow along by RSS in the meantime.",
    rss: "Subscribe via RSS",
  },
  footer: { rights: "© 2026 Juan Luis Villaseñor. All spells reserved." },
  post: {
    back: "← Back to the grimoire",
    minRead: "min read",
    writingAs: "writing as",
    enjoyed: "Enjoyed this entry?",
    getNext: "Get the next one by letter.",
    keepReading: "Keep reading",
    alsoIn: "This entry is also available in",
  },
  notFound: {
    title: "This page has vanished",
    text: "The spell fizzled, or the entry was never inscribed.",
    cta: "Return to the study",
  },
};

export type Dictionary = typeof en;

const es: Dictionary = {
  meta: {
    title: "Gato Mago: Ensayos, hechizos y notas de campo",
    homeTitle: "Gato Mago: Ensayos, hechizos y notas de campo de Juan Luis Villaseñor",
    description:
      "Ensayos, hechizos y notas de campo de Juan Luis Villaseñor, conocido como Gato Mago: un estudio a la luz de las velas sobre magia, oficio y curiosidad.",
    ogAlt:
      "Gato Mago: Descubre la magia. Un gato mago con sombrero remendado sostiene una esfera brillante.",
  },
  a11y: { skip: "Saltar al contenido", mainNav: "Principal", footerNav: "Pie de página", home: "Gato Mago, inicio", language: "Idioma" },
  nav: { grimoire: "Grimorio", about: "Acerca de", circle: "Únete al Círculo" },
  hero: {
    titleLead: "Despachos desde el",
    titleEm: "estudio a la luz de las velas",
    sub: "Ensayos, hechizos y notas de campo de Juan Luis Villaseñor, conocido en estas salas como Gato Mago. Para leer a la luz de las velas; no hace falta escoba.",
    cta: "Leer lo último",
    imageAlt:
      "Gato Mago, un gato gris con un sombrero de mago remendado, sostiene una esfera de cristal brillante en una biblioteca iluminada por velas",
  },
  featured: { label: "Recién escrito", cta: "Leer la entrada →" },
  grimoire: {
    title: "Desde el Grimorio",
    empty: "El grimorio aún se está escribiendo. Vuelve pronto.",
    more: "Vienen más entradas en camino.",
  },
  about: {
    heading: "Detrás del sombrero:",
    fallbackBio: "Ensayos, hechizos y notas de campo desde el estudio a la luz de las velas.",
    linkedin: "LinkedIn →",
    portraitAlt: "Retrato de Gato Mago, el gato gris con sombrero de mago",
  },
  newsletter: {
    title: "Únete al Círculo",
    text: "Una carta cuando llegue una nueva entrada. Sin spam, sin hechizos sobre tu bandeja de entrada.",
    label: "Correo electrónico",
    placeholder: "tu@correo.com",
    submit: "Suscribirme",
    pending: "Las cartas aún no vuelan. Mientras tanto, sigue las novedades por RSS.",
    rss: "Suscribirse por RSS",
  },
  footer: { rights: "© 2026 Juan Luis Villaseñor. Todos los hechizos reservados." },
  post: {
    back: "← Volver al grimorio",
    minRead: "min de lectura",
    writingAs: "escribe como",
    enjoyed: "¿Te gustó esta entrada?",
    getNext: "Recibe la siguiente por carta.",
    keepReading: "Sigue leyendo",
    alsoIn: "Esta entrada también está disponible en",
  },
  notFound: {
    title: "Esta página se ha desvanecido",
    text: "El hechizo falló, o la entrada nunca se escribió.",
    cta: "Volver al estudio",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, es };

export const getDictionary = (lang: Locale): Dictionary => dictionaries[lang];
