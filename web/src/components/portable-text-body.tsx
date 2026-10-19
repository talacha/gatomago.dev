import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { urlFor } from "@/sanity/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.15] text-parch">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 font-heading text-[28px] font-semibold leading-[1.2] text-parch">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-[3px] border-gold py-2 pl-8 font-heading text-[32px] font-medium italic leading-[1.3] text-parch">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => <a href={value?.href}>{children}</a>,
  },
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <figure className="my-2">
          <Image
            src={urlFor(value).width(1440).url()}
            alt={value.alt ?? ""}
            width={1440}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            className="h-auto w-full rounded-[10px]"
          />
          {value.caption && (
            <figcaption className="mt-3 text-center text-[15px] italic text-muted">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
    code: ({ value }) => (
      <pre className="my-2 overflow-x-auto rounded-xl border border-gold/30 bg-void p-6 font-mono text-[15px] leading-relaxed text-[#d8e9e5]">
        <code>{value?.code}</code>
      </pre>
    ),
  },
};

export function PortableTextBody({ value }: { value: Parameters<typeof PortableText>[0]["value"] }) {
  return (
    <div className="prose-gm flex flex-col gap-7">
      <PortableText value={value} components={components} />
    </div>
  );
}
