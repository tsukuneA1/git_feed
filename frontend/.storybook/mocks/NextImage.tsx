// Minimal mock for next/image to work in Storybook/Vite
// Renders a plain img with passed props
import type React from "react";

// Match a subset of next/image props used in our components
type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  unoptimized?: boolean;
};

const NextImage = ({ unoptimized: _u, alt, ...props }: ImgProps) => {
  return (
    // biome-ignore lint/performance/noImgElement: Storybook mock replacing next/image
    <img {...props} alt={alt ?? ""} aria-hidden={alt ? undefined : true} />
  );
};

export default NextImage;
