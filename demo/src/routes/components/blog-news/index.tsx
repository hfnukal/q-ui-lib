import { component$ } from "@builder.io/qwik";
import { WebBlogNews } from "~/components/ui/blog-news";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — blog / novinky</h1>
      <CodeExample>
        <Desc>Seznam článků s odkazem a datem.</Desc>
        <TabExample>
          <WebBlogNews
            title="Z blogu"
            posts={[
              {
                title: "Jak zrychlit LCP",
                excerpt: "Obrázky, fonty, lazy loading.",
                date: "2026-03-01",
                href: "#",
              },
              {
                title: "Přístupnost formulářů",
                href: "#",
              },
            ]}
          />
        </TabExample>
        <TabCode>{`<WebBlogNews title="Z blogu" posts={[…]} />`}</TabCode>
      </CodeExample>
    </div>
  );
});
