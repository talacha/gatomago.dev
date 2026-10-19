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
    text: "One email when a new entry is published. No spam, no tracking, and you can leave at any time.",
    label: "Email address",
    placeholder: "your@email.com",
    consentBefore: "I agree to receive an email from Gato Mago whenever a new post is published, and I have read the ",
    consentLink: "privacy policy",
    consentAfter: ". I can unsubscribe at any time.",
    submit: "Subscribe",
    sending: "Sending…",
    ok: "Almost there! Check your inbox and click the link to confirm your subscription.",
    invalidEmail: "Please enter a valid email address.",
    consentRequired: "Please tick the box to agree before subscribing.",
    rateLimited: "Too many attempts. Please try again in a little while.",
    error: "Something went wrong on our side. Please try again later.",
    rss: "Subscribe via RSS",
  },
  newsletterPages: {
    confirmTitle: "Confirm your subscription",
    confirmText: "One last step: confirm that you want to receive an email when new posts are published.",
    confirmButton: "Confirm subscription",
    unsubscribeTitle: "Leave the Circle",
    unsubscribeText: "You can stop the emails, or also delete your data from our records.",
    unsubscribeButton: "Unsubscribe",
    eraseText: "Prefer to be forgotten entirely? This permanently deletes your email address and consent records.",
    eraseButton: "Delete my data",
    invalidTitle: "This link isn't valid",
    invalidText: "It may have expired or already been used. You can subscribe again from the home page.",
    confirmedTitle: "You're in the Circle",
    confirmedText: "Your subscription is confirmed. You'll get an email when a new post is published.",
    unsubscribedTitle: "You've been unsubscribed",
    unsubscribedText: "You won't receive any more emails. We keep only your address, to honour this choice.",
    deletedTitle: "Your data has been deleted",
    deletedText: "Your email address and records have been permanently removed.",
    home: "Back to the home page",
  },
  footer: { rights: "© 2026 Juan Luis Villaseñor. All spells reserved.", privacy: "Privacy" },
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
    text: "Un correo cuando se publique una entrada nueva. Sin spam, sin rastreo, y puedes irte cuando quieras.",
    label: "Correo electrónico",
    placeholder: "tu@correo.com",
    consentBefore: "Acepto recibir un correo de Gato Mago cada vez que se publique una entrada nueva y he leído la ",
    consentLink: "política de privacidad",
    consentAfter: ". Puedo darme de baja en cualquier momento.",
    submit: "Suscribirme",
    sending: "Enviando…",
    ok: "¡Casi listo! Revisa tu bandeja de entrada y haz clic en el enlace para confirmar tu suscripción.",
    invalidEmail: "Introduce un correo electrónico válido.",
    consentRequired: "Marca la casilla para aceptar antes de suscribirte.",
    rateLimited: "Demasiados intentos. Inténtalo de nuevo en un rato.",
    error: "Algo salió mal por nuestra parte. Inténtalo de nuevo más tarde.",
    rss: "Suscribirse por RSS",
  },
  newsletterPages: {
    confirmTitle: "Confirma tu suscripción",
    confirmText: "Un último paso: confirma que quieres recibir un correo cuando se publiquen entradas nuevas.",
    confirmButton: "Confirmar suscripción",
    unsubscribeTitle: "Salir del Círculo",
    unsubscribeText: "Puedes dejar de recibir correos, o además borrar tus datos de nuestros registros.",
    unsubscribeButton: "Darme de baja",
    eraseText: "¿Prefieres que te olvidemos por completo? Esto elimina de forma permanente tu correo y los registros de consentimiento.",
    eraseButton: "Borrar mis datos",
    invalidTitle: "Este enlace no es válido",
    invalidText: "Puede que haya caducado o que ya se haya usado. Puedes suscribirte de nuevo desde la página de inicio.",
    confirmedTitle: "Ya estás en el Círculo",
    confirmedText: "Tu suscripción está confirmada. Recibirás un correo cuando se publique una entrada nueva.",
    unsubscribedTitle: "Te has dado de baja",
    unsubscribedText: "No recibirás más correos. Solo conservamos tu dirección para respetar esta decisión.",
    deletedTitle: "Tus datos se han borrado",
    deletedText: "Tu correo electrónico y tus registros se han eliminado de forma permanente.",
    home: "Volver a la página de inicio",
  },
  footer: { rights: "© 2026 Juan Luis Villaseñor. Todos los hechizos reservados.", privacy: "Privacidad" },
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
