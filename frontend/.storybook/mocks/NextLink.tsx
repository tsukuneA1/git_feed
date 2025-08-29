import React from 'react';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

const NextLink = ({ href, children, ...rest }: Props) => {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
};

export default NextLink;
