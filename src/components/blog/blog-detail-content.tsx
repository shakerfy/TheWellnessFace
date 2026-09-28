import React from "react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blogs";
import { BlogArticleHeader } from "./blog-article-header";
import { BlogMarkdownRenderer } from "./blog-markdown-renderer";
import { BlogAuthorBio } from "./blog-author-bio";
import { BlogSidebar } from "./blog-sidebar";
import { BlogBottomRelated } from "./blog-bottom-related";

export interface BlogDetailContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogDetailContent({
  post,
  relatedPosts,
}: BlogDetailContentProps) {
  return (
    <main className="flex-1 pb-24 pt-28">
      {/* Header, Breadcrumbs & Hero Image */}
      <BlogArticleHeader post={post} />

      {/* Main Grid: Article Content (8 cols) + Sidebar (4 cols) */}
      <article className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">
          {/* Article Body */}
          <div className="lg:col-span-8 space-y-6">
            <BlogMarkdownRenderer content={post.content} />

            {/* Article Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-border">
                <span className="text-xs font-semibold text-muted-foreground mr-1">
                  Etiquetas:
                </span>
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full text-xs"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Author Bio Box */}
            <BlogAuthorBio author={post.author} />
          </div>

          {/* Right Sidebar */}
          <BlogSidebar relatedPosts={relatedPosts} />
        </div>
      </article>

      {/* Bottom Related Posts Carousel/Grid */}
      <BlogBottomRelated relatedPosts={relatedPosts} />
    </main>
  );
}
