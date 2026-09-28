import React from "react";
import type { BlogPost } from "@/lib/blogs";

export interface BlogAuthorBioProps {
  author: BlogPost["author"];
}

export function BlogAuthorBio({ author }: BlogAuthorBioProps) {
  return (
    <div className="my-8 rounded-3xl border border-border bg-card p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
      <img
        src={author.avatar}
        alt={author.name}
        className="h-16 w-16 rounded-full object-cover border border-border shrink-0"
      />
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase text-primary">
          Escrito por
        </div>
        <h4 className="text-lg font-bold text-foreground">{author.name}</h4>
        <p className="text-xs text-muted-foreground font-medium">
          {author.role}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
          {author.bio}
        </p>
      </div>
    </div>
  );
}
