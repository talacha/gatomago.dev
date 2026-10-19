export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gatomago.dev").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "Gato Mago";

export const SITE_DESCRIPTION =
  "Essays, charms and field notes by Juan Luis Villaseñor, known as Gato Mago: a candlelit study of magic, craft and curiosity.";

export const AUTHOR = {
  name: "Juan Luis Villaseñor",
  alias: "Gato Mago",
  linkedin: "https://www.linkedin.com/in/juanluisvillase%C3%B1or/",
};

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
