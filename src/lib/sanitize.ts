import sanitizeHtml from "sanitize-html";

/**
 * Every piece of post HTML goes through here before it is stored.
 * No scripts, iframes, inline event handlers or style attributes survive,
 * and links/images must be http(s) or site-relative.
 */
export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "p", "br", "hr", "strong", "em", "b", "i", "u", "s",
      "a", "ul", "ol", "li", "blockquote", "figure", "figcaption", "img",
      "table", "thead", "tbody", "tr", "th", "td", "code", "pre", "span",
    ],
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
      img: ["src", "alt", "width", "height", "loading"],
      th: ["scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//.test(attribs.href ?? "");
        return {
          tagName,
          attribs: external
            ? { ...attribs, rel: "noopener noreferrer nofollow", target: "_blank" }
            : attribs,
        };
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: "lazy" },
      }),
    },
  });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
