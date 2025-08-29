import React from "react";
import type { LinkPreview } from "@/features/feed/types";

function hostFromUrl(url?: string) {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
}

const FALLBACK_OGP: Record<string, string> = {
  "zenn.dev": "https://zenn.dev/images/og-default.png",
  "qiita.com":
    "https://cdn.qiita.com/assets/public/ogp-default-7a9a5f1cc0a6a3d9dcd9f2cb1d6a0f77.png",
  "note.com":
    "https://assets.st-note.com/production/uploads/images/og_image.png",
};

export function LinkPreviewCard({
  url,
  preview,
}: {
  url: string;
  preview?: LinkPreview;
}) {
  const site = preview?.siteName || hostFromUrl(url);
  const host = hostFromUrl(preview?.siteUrl || url);

  const favicon = host
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        host
      )}&sz=256`
    : undefined;
  const src = preview?.imageUrl || FALLBACK_OGP[host] || favicon;

  function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    const el = e.currentTarget;
    if (el.dataset.triedFavicon !== "1" && favicon) {
      el.dataset.triedFavicon = "1";
      el.src = favicon;
    } else {
      el.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNzIwJyBoZWlnaHQ9JzQwNScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZWVlZWVlJy8+PC9zdmc+";
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block overflow-hidden rounded-xl border border-border hover:border-gray-300"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          onError={handleImgError}
          alt={preview?.title || site}
          className="w-full object-cover aspect-[16/9] bg-muted"
        />
      ) : (
        <div className="aspect-[16/9] w-full animate-pulse bg-muted" />
      )}
      <div className="px-3 py-2">
        <div className="line-clamp-2 text-sm font-medium">
          {preview?.title || url}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          From {site || hostFromUrl(url)}
        </div>
      </div>
    </a>
  );
}

