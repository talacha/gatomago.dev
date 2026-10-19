import type { Locale } from "./config";

export type PrivacySection = { heading: string; body: string[] };
export type PrivacyPolicy = {
  title: string;
  updated: string;
  intro: string;
  contactLabel: string;
  sections: PrivacySection[];
};

/** Bump with CONSENT_VERSION whenever the newsletter terms change materially. */
export const PRIVACY_UPDATED = "2026-10-19";

export const privacy: Record<Locale, PrivacyPolicy> = {
  en: {
    title: "Privacy policy",
    updated: "Last updated: 19 October 2026",
    intro:
      "This page explains what personal data the Gato Mago website and newsletter process, why, and the choices you have. In short: we collect only an email address and your consent, we use it only to tell you about new posts, and you can leave or erase your data at any time.",
    contactLabel: "Contact",
    sections: [
      {
        heading: "Who is responsible",
        body: [
          "The data controller is Juan Luis Villaseñor, who writes as Gato Mago. You can reach the controller using the contact details at the end of this page.",
        ],
      },
      {
        heading: "What data we process",
        body: [
          "Newsletter: your email address, your chosen language, the date and the version of the text you agreed to, the date you confirmed, and, if you leave, the date you unsubscribed.",
          "Abuse protection: when you submit the sign-up form, a keyed one-way hash of your IP address and of your email address is kept for at most 24 hours to limit repeated submissions. The raw IP address is not stored with your subscription.",
          "Hosting: our hosting provider keeps standard server logs (such as IP address and requested page) for security and operation.",
          "This website does not use cookies, analytics or advertising trackers.",
        ],
      },
      {
        heading: "Why we process it and our legal basis",
        body: [
          "We send you an email when a new post is published because you asked us to. The legal basis is your consent (Article 6(1)(a) GDPR, and the equivalent in UK GDPR and similar laws). We use double opt-in: nothing is sent until you click the link in the confirmation email.",
          "Abuse protection and server logs rely on our legitimate interest in keeping the service secure (Article 6(1)(f) GDPR).",
          "We do not use your data for anything else, we do not sell or share it for advertising, and we do not make automated decisions about you.",
        ],
      },
      {
        heading: "Who receives your data",
        body: [
          "We use service providers that process data on our behalf under data processing terms: Resend (sending email), Supabase (database hosting) and Vercel (website hosting and serving).",
          "Some of these providers may process data outside the European Economic Area or the UK, including in the United States. Where that happens, transfers rely on safeguards such as the EU–US Data Privacy Framework or Standard Contractual Clauses.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Sign-ups you never confirm are deleted automatically after 7 days.",
          "Confirmed subscribers are kept until they unsubscribe or ask for deletion.",
          "After you unsubscribe we keep only your email address and the relevant dates, so that we can honour your choice and not email you again. If you prefer to be forgotten completely, use the delete option, and your record is permanently removed.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to access your data, have it corrected or erased, restrict or object to its processing, receive a copy in a portable format, and withdraw your consent at any time without affecting what was done before. Depending on where you live, laws such as the GDPR, UK GDPR, California's CCPA/CPRA and Brazil's LGPD may give you additional rights.",
          "Every email we send includes a link to unsubscribe or delete your data in one step. You can also write to the contact below.",
          "You also have the right to complain to your local data protection authority, for example the Spanish AEPD or the UK ICO.",
        ],
      },
      {
        heading: "Changes",
        body: [
          "If this policy changes in a way that matters, we will update the date above and, where the law requires it, ask for your consent again.",
        ],
      },
    ],
  },
  es: {
    title: "Política de privacidad",
    updated: "Última actualización: 19 de octubre de 2026",
    intro:
      "Esta página explica qué datos personales tratan el sitio web y el boletín de Gato Mago, para qué y qué opciones tienes. En resumen: solo recogemos un correo electrónico y tu consentimiento, lo usamos únicamente para avisarte de nuevas entradas y puedes darte de baja o borrar tus datos cuando quieras.",
    contactLabel: "Contacto",
    sections: [
      {
        heading: "Quién es el responsable",
        body: [
          "El responsable del tratamiento es Juan Luis Villaseñor, que escribe como Gato Mago. Puedes contactar con el responsable mediante los datos que aparecen al final de esta página.",
        ],
      },
      {
        heading: "Qué datos tratamos",
        body: [
          "Boletín: tu correo electrónico, el idioma elegido, la fecha y la versión del texto que aceptaste, la fecha en que lo confirmaste y, si te das de baja, la fecha de la baja.",
          "Protección frente al abuso: al enviar el formulario, se conserva durante 24 horas como máximo un resumen irreversible con clave (hash) de tu dirección IP y de tu correo para limitar envíos repetidos. La dirección IP en claro no se guarda junto a tu suscripción.",
          "Alojamiento: nuestro proveedor de alojamiento conserva registros habituales del servidor (como la dirección IP y la página solicitada) por seguridad y funcionamiento.",
          "Este sitio no usa cookies, analítica ni rastreadores publicitarios.",
        ],
      },
      {
        heading: "Para qué los tratamos y base jurídica",
        body: [
          "Te enviamos un correo cuando se publica una entrada nueva porque nos lo pediste. La base jurídica es tu consentimiento (artículo 6.1.a del RGPD y su equivalente en el RGPD del Reino Unido y leyes similares). Usamos doble confirmación: no se envía nada hasta que haces clic en el enlace del correo de confirmación.",
          "La protección frente al abuso y los registros del servidor se basan en nuestro interés legítimo en mantener el servicio seguro (artículo 6.1.f del RGPD).",
          "No usamos tus datos para nada más, no los vendemos ni los compartimos con fines publicitarios y no tomamos decisiones automatizadas sobre ti.",
        ],
      },
      {
        heading: "Quién recibe tus datos",
        body: [
          "Usamos proveedores que tratan datos por nuestra cuenta con contratos de encargado del tratamiento: Resend (envío de correo), Supabase (alojamiento de la base de datos) y Vercel (alojamiento y servicio del sitio web).",
          "Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo o del Reino Unido, incluido Estados Unidos. En ese caso, las transferencias se amparan en garantías como el Marco de Privacidad de Datos UE–EE. UU. o las Cláusulas Contractuales Tipo.",
        ],
      },
      {
        heading: "Cuánto tiempo los conservamos",
        body: [
          "Las suscripciones que nunca confirmas se eliminan automáticamente a los 7 días.",
          "Las personas suscritas confirmadas se conservan hasta que se dan de baja o piden el borrado.",
          "Tras darte de baja solo conservamos tu correo y las fechas pertinentes para respetar tu decisión y no volver a escribirte. Si prefieres que te olvidemos por completo, usa la opción de borrar y tu registro se elimina de forma permanente.",
        ],
      },
      {
        heading: "Tus derechos",
        body: [
          "Tienes derecho a acceder a tus datos, a que se rectifiquen o supriman, a limitar u oponerte a su tratamiento, a recibir una copia en formato portable y a retirar tu consentimiento en cualquier momento sin que afecte a lo hecho antes. Según dónde vivas, leyes como el RGPD, el RGPD del Reino Unido, la CCPA/CPRA de California o la LGPD de Brasil pueden darte derechos adicionales.",
          "Cada correo que enviamos incluye un enlace para darte de baja o borrar tus datos en un solo paso. También puedes escribir al contacto indicado abajo.",
          "También tienes derecho a presentar una reclamación ante tu autoridad de protección de datos, por ejemplo la AEPD en España o la ICO en el Reino Unido.",
        ],
      },
      {
        heading: "Cambios",
        body: [
          "Si esta política cambia de forma relevante, actualizaremos la fecha indicada arriba y, cuando la ley lo exija, volveremos a pedir tu consentimiento.",
        ],
      },
    ],
  },
};
