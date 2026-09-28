import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/blogs";
import { BlogDetailContent } from "@/components/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    const title = p ? `${p.title} — Blog Shakerfy` : "Artículo — Shakerfy";
    const desc = p?.excerpt ?? "Artículo de fitness y salud en Shakerfy.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(p?.image ? [{ property: "og:image", content: p.image }] : []),
      ],
    };
  },
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { post } = Route.useLoaderData();
  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      <SiteHeader />
      <BlogDetailContent post={post} relatedPosts={relatedPosts} />
      <SiteFooter />
    </div>
  );
}
