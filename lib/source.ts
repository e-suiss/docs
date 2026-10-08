import { loader } from "fumadocs-core/source";
import { pageSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import { z } from "zod";

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      /** Small label above the title, e.g. "React Component" or "Service". */
      eyebrow: z.string().optional(),
    }),
    // Lets each page be served as Markdown for "Copy page" and AI tools.
    postprocess: { includeProcessedMarkdown: true },
  },
});

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
