"use client";

import { Anchor } from "@/components/site/anchor";
import { strings } from "@/lib/strings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/ui/theme";
import { products } from "@/lib/products";

export function Footer() {

  const sections = [
    {
      title: strings.interfaceFamily,
      links: products
        .filter((product) => product.family === "interface")
        .map((product) => ({
          label: product.name,
          href: `/docs/${product.slug}`,
        })),
    },
    {
      title: strings.platformFamily,
      links: products
        .filter((product) => product.family === "platform")
        .map((product) => ({
          label: product.name,
          href: `/docs/${product.slug}`,
        })),
    },
    {
      title: strings.resources,
      links: [
        { label: strings.documentation, href: "/docs" },
        { label: strings.github, href: "https://github.com/e-suiss" },
      ],
    },
  ];

  return (
    <footer className="bg-surface-secondary text-xs text-label-secondary">
      <div className="mx-auto flex max-w-245 flex-col gap-4 px-5.5 pt-6 pb-5.5">
        <nav aria-label="Directory" className="hidden grid-cols-5 gap-5 md:grid">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <h3 className="font-semibold text-label">{section.title}</h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Anchor href={link.href} className="hover:underline">
                      {link.label}
                    </Anchor>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <Accordion aria-label="Directory" className="md:hidden">
          {sections.map((section) => (
            <AccordionItem
              key={section.title}
              value={section.title}
              className="ms-0 border-b border-separator not-first:border-t-0"
            >
              <AccordionTrigger className="pe-0 text-sm text-label hover:no-underline">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="pe-0 pb-3.5 [&_a]:no-underline [&_a]:hover:underline">
                <ul className="flex flex-col gap-2.5 ps-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Anchor href={link.href} className="text-sm text-label">
                        {link.label}
                      </Anchor>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-separator pt-2.5 md:mt-4">
          <span>{strings.copyright}</span>
          <span>{strings.license}</span>
          <div className="flex items-center gap-3 md:ms-auto">
            <ThemeToggle size="icon-xs" className="size-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
