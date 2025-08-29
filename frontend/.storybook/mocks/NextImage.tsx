// Minimal mock for next/image to work in Storybook/Vite
// Renders a plain img with passed props
import React from 'react';

// Match a subset of next/image props used in our components
type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  unoptimized?: boolean;
};

const NextImage = ({ unoptimized: _u, ...props }: ImgProps) => {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...props} />;
};

export default NextImage;
