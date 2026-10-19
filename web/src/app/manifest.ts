import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gato Mago",
    short_name: "Gato Mago",
    description: "Essays, charms and field notes by Juan Luis Villaseñor.",
    start_url: "/",
    display: "browser",
    background_color: "#14161d",
    theme_color: "#14161d",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
