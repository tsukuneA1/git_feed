import React from "react";
import Image from "next/image";

export function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={32}
      height={32}
      className="h-8 w-8 rounded-full ring-1 ring-black/5"
    />
  );
}
