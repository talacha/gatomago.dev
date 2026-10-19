import type { Locale } from "@/i18n/config";

type Copy = {
  confirm: {
    subject: string;
    preheader: string;
    heading: string;
    body: string;
    button: string;
    ignore: string;
    expires: string;
  };
  broadcast: {
    subjectPrefix: string;
    button: string;
    why: string;
    unsubscribe: string;
    privacy: string;
  };
};

export const emailCopy: Record<Locale, Copy> = {
  en: {
    confirm: {
      subject: "Confirm your subscription to Gato Mago",
      preheader: "One click to join the Circle.",
      heading: "Confirm your subscription",
      body: "You (or someone using your address) asked to receive an email from Gato Mago whenever a new post is published. Please confirm that this is what you want.",
      button: "Confirm subscription",
      ignore:
        "If you didn't ask for this, simply ignore this email: you will not be subscribed and we will delete your address within a few days.",
      expires: "This link works for 48 hours.",
    },
    broadcast: {
      subjectPrefix: "New on Gato Mago:",
      button: "Read the post",
      why: "You are receiving this because you subscribed to Gato Mago and confirmed your address.",
      unsubscribe: "Unsubscribe or delete my data",
      privacy: "Privacy policy",
    },
  },
  es: {
    confirm: {
      subject: "Confirma tu suscripción a Gato Mago",
      preheader: "Un clic para unirte al Círculo.",
      heading: "Confirma tu suscripción",
      body: "Tú (o alguien que usó tu dirección) pidió recibir un correo de Gato Mago cada vez que se publique una entrada nueva. Confirma que eso es lo que quieres.",
      button: "Confirmar suscripción",
      ignore:
        "Si no lo pediste, ignora este correo: no quedarás suscrito y eliminaremos tu dirección en pocos días.",
      expires: "Este enlace funciona durante 48 horas.",
    },
    broadcast: {
      subjectPrefix: "Nuevo en Gato Mago:",
      button: "Leer la entrada",
      why: "Recibes este correo porque te suscribiste a Gato Mago y confirmaste tu dirección.",
      unsubscribe: "Darme de baja o borrar mis datos",
      privacy: "Política de privacidad",
    },
  },
};
