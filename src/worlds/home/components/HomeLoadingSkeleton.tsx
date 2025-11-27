"use client";
import React from "react";
import { cn } from "@/shared/lib/utils";

interface HomeLoadingSkeletonProps {
  isGridView: boolean;
  count?: number;
}

export const HomeLoadingSkeleton: React.FC<HomeLoadingSkeletonProps> = ({
  isGridView,
  count = 8,
}) => {
  return (
    <div
      className={cn(
        isGridView
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-2"
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-border p-5 animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-muted/30" />
              <div className="h-4 w-16 bg-muted/30" />
            </div>
          </div>
          <div className="h-4 w-3/4 bg-muted/30 mb-2" />
          <div className="flex items-center gap-3">
            <div className="h-3 w-20 bg-muted/30" />
            <div className="h-3 w-12 bg-muted/30" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeLoadingSkeleton;
