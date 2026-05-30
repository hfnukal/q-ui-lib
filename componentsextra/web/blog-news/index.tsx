/**
 * @component blog-news
 * @title Web — blog / novinky
 * @version 1.0.0
 * @example Seznam článků
 * Nadpis, perex, datum a odkaz na detail.
 * ```tsx
 * import { WebBlogNews } from "~/components/ui/blog-news";
 *
 * <WebBlogNews
 *   title="Z blogu"
 *   posts={[
 *     {
 *       title: "Jak jsme zrychlili LCP o 40 %",
 *       excerpt: "Praktické tipy pro obrázky a fonty.",
 *       date: "2026-03-01",
 *       href: "/blog/lcp",
 *     },
 *     {
 *       title: "Přístupnost formulářů",
 *       href: "/blog/a11y-forms",
 *     },
 *   ]}
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface WebBlogPost {
  title: string;
  excerpt?: string;
  date?: string;
  href: string;
}

export interface WebBlogNewsProps {
  title?: string;
  subtitle?: string;
  posts: WebBlogPost[];
  /** Text odkazu u každého záznamu */
  readMoreLabel?: string;
  class?: string;
}

const linkClass =
  "text-headline font-semibold text-label no-underline hover:text-link focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded";

/**
 * Seznam posledních článků nebo novinek.
 */
export const WebBlogNews = component$<WebBlogNewsProps>((props) => {
  const { title, subtitle, posts, readMoreLabel = "Číst dál", class: className } = props;

  return (
    <section class={["bg-grouped-background", className ?? ""].filter(Boolean).join(" ")}>
      <div class="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div class="mx-auto max-w-2xl text-center">
          {title ? <h2 class="text-title-2 font-bold text-label">{title}</h2> : null}
          {subtitle ? <p class="mt-3 text-body text-secondary-label">{subtitle}</p> : null}
        </div>
        <ul class="mt-10 divide-y divide-separator rounded-xl border border-separator bg-grouped-surface">
          {posts.map((post) => (
            <li key={post.href}>
              <article class="flex flex-col gap-2 px-5 py-5 md:flex-row md:items-start md:justify-between md:gap-8">
                <div class="min-w-0 flex-1">
                  <h3 class="text-title-3">
                    <a href={post.href} class={linkClass}>
                      {post.title}
                    </a>
                  </h3>
                  {post.excerpt ? <p class="mt-2 text-callout text-secondary-label">{post.excerpt}</p> : null}
                </div>
                <div class="flex shrink-0 flex-col items-start gap-2 md:items-end">
                  {post.date ? (
                    <time class="text-caption-1 text-tertiary-label" dateTime={post.date}>
                      {post.date}
                    </time>
                  ) : null}
                  <a href={post.href} class="text-callout font-medium text-link hover:underline">
                    {readMoreLabel}
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});
