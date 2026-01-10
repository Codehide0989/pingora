import { getBlogPosts } from "@/content/utils";
import { Feed } from "feed";
import { getAuthor } from "src/data/author";

export async function GET() {
  const feed = new Feed({
    id: "https://www.pingora.dev/blog",
    title: "Pingora - Blog",
    description: "Pingora blog feed",
    generator: "RSS for Node and Next.js",
    feedLinks: {
      rss: "https://www.pingora.dev/blog/feed.xml",
    },
    link: "https://www.pingora.dev",
    author: {
      name: "Pingora Team",
      email: "ping@pingora.dev",
      link: "https://pingora.dev",
    },
    copyright: `Copyright ${new Date().getFullYear().toString()}, Pingora`,
    language: "en-US",
    updated: new Date(),
    ttl: 60,
  });

  const allPosts = getBlogPosts();

  allPosts
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime(),
    )
    .map((post) => {
      const author = getAuthor(post.metadata.author);
      return feed.addItem({
        id: `https://www.pingora.dev/blog/${post.slug}`,
        title: post.metadata.title,
        description: post.metadata.description,
        link: `https://www.pingora.dev/blog/${post.slug}`,
        author: [
          typeof author === "string"
            ? { name: author }
            : {
                name: author.name,
                link: author.url,
              },
        ],
        image: post.metadata.image
          ? `https://www.pingora.dev${post.metadata.image}`
          : undefined,
        date: post.metadata.publishedAt,
      });
    });
  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
