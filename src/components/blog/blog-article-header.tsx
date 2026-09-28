import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  ChevronRight,
  MessageCircle,
  Twitter,
  Linkedin,
  Copy,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blogs";

export interface BlogArticleHeaderProps {
  post: BlogPost;
}

export function BlogArticleHeader({ post }: BlogArticleHeaderProps) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Mirá este artículo en Shakerfy: ${post.title}\n${currentUrl}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`"${post.title}" vía @ShakerfyApp`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
        currentUrl,
      )}`,
      "_blank",
    );
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl,
      )}`,
      "_blank",
    );
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="mx-auto max-w-5xl px-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
          <Link to="/" className="hover:text-foreground transition-colors">
            Inicio
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground/80">{post.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
            {post.title}
          </span>
        </nav>
      </div>

      {/* Article Header Content */}
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <Badge className="rounded-full bg-primary text-primary-foreground font-bold px-3 py-1">
              {post.category}
            </Badge>
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground/90 max-w-3xl leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author bar & Share buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border-y border-border/60 py-4 my-6">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-11 w-11 rounded-full object-cover border border-border"
              />
              <div className="text-left">
                <div className="text-sm font-bold text-foreground">
                  {post.author.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {post.author.role}
                </div>
              </div>
            </div>

            {/* Share actions */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground mr-1 hidden sm:inline">
                Compartir:
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30"
                onClick={shareWhatsApp}
                title="Compartir en WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-blue-400/10 hover:text-blue-400 hover:border-blue-400/30"
                onClick={shareTwitter}
                title="Compartir en Twitter / X"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/30"
                onClick={shareLinkedIn}
                title="Compartir en LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl"
                onClick={handleCopyLink}
                title="Copiar enlace"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Hero Image */}
        <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-muted">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </>
  );
}
