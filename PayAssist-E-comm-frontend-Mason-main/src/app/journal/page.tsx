"use client";

import { ContentPage } from "@components/mason/ContentPage";

const posts = [
  { tag: "Styling", title: "How to layer a living room", date: "May 2026", excerpt: "Start with one anchor piece, then build texture outward — wool, linen, oak and a little patina." },
  { tag: "Materials", title: "Living with natural linen", date: "April 2026", excerpt: "Why we choose heavyweight Belgian linen, and how it softens into the best version of itself." },
  { tag: "The home", title: "Building a calm bedroom", date: "April 2026", excerpt: "A restrained palette, low furniture and warm light — the quiet rules of a restful room." },
  { tag: "Care", title: "Caring for hand-thrown stoneware", date: "March 2026", excerpt: "Hand-wash, never shock with hot water on a cold piece, and let it dry slowly. It will outlive you." },
  { tag: "Materials", title: "Why unlacquered brass", date: "March 2026", excerpt: "Most brass on the high street is sealed in lacquer to keep it bright. We don't. Here's why." },
];

export default function JournalPage() {
  return (
    <ContentPage eyebrow="The Journal" title="Notes from the studio">
      <p className="!mb-12">
        Short pieces on styling, materials and the small things that make a home feel considered.
        Written by our team and the makers we work with.
      </p>
      <div className="not-prose space-y-9">
        {posts.map((post) => (
          <article key={post.title} className="pb-9 border-b border-coffee/15 last:border-b-0">
            <div className="flex gap-3 items-center text-[11px] tracking-[0.18em] uppercase text-taupe mb-3">
              <span>{post.tag}</span>
              <span className="text-coffee-3">·</span>
              <span>{post.date}</span>
            </div>
            <h2 className="font-display !mt-0 !mb-3 text-[26px] !text-ink leading-[1.2] !font-medium">{post.title}</h2>
            <p className="!mb-0 text-coffee-2">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </ContentPage>
  );
}
