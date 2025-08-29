import React from "react";
import type { SVGProps, JSX } from "react";

export type SvgIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

export const Icons: Record<
  | "Push"
  | "PR"
  | "Issue"
  | "Star"
  | "Fork"
  | "Follow"
  | "Release"
  | "QA"
  | "Article"
  | "Package"
  | "Deploy"
  | "Tag"
  | "Milestone"
  | "Share"
  | "Community",
  SvgIcon
> = {
  Push: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2a3 3 0 0 1 3 3v7h2l-3 4-3-4h2V5a1 1 0 1 0-2 0v3H9V5a3 3 0 0 1 3-3Zm-6 18h12v2H6v-2Z"
      />
    </svg>
  ),
  PR: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M7 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm10 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM10 7h5a3 3 0 0 1 3 3v4h-2v-4a1 1 0 0 0-1-1h-5V7Z"
      />
    </svg>
  ),
  Issue: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M11 7h2v8h-2V7Zm0 10h2v2h-2v-2Zm1-15a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"
      />
    </svg>
  ),
  Star: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2 9.5 8H3l5 3.8L6.5 18 12 14.6 17.5 18 16 11.8 21 8h-6.5L12 2Z"
      />
    </svg>
  ),
  Fork: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M7 3a3 3 0 1 0 0 6c.6 0 1.1-.2 1.6-.4A5 5 0 0 0 11 12v1.1A3 3 0 0 0 9 16a3 3 0 1 0 3 3v-5a7 7 0 0 1 4.4-6.5c.5.3 1 .5 1.6.5a3 3 0 1 0-3-3c0 .4.1.8.3 1.2A9 9 0 0 0 13 7.5V7a4 4 0 0 0-4-4ZM17 19a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM7 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm10-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-8 14a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
      />
    </svg>
  ),
  Follow: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-8 8a8 8 0 1 1 16 0H4Z"
      />
    </svg>
  ),
  Release: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.2 6.5 3.6v7.4L12 18.8l-6.5-3.6V7.8L12 4.2Z"
      />
    </svg>
  ),
  QA: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M4 3h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 5v-5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 4h12v2H6V7Zm0 4h8v2H6v-2Z"
      />
    </svg>
  ),
  Article: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5ZM7 12h10v2H7v-2Zm0 4h10v2H7v-2Zm0-8h5v2H7V8Z"
      />
    </svg>
  ),
  Package: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2 3 7v10l9 5 9-5V7L12 2Zm0 2.2 6.5 3.6V12L12 15.8 5.5 12V7.8L12 4.2ZM8 9h8v2H8V9Z"
      />
    </svg>
  ),
  Deploy: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M3 20h18v2H3v-2Zm9-18 6 6h-4v6h-4V8H6l6-6Z"
      />
    </svg>
  ),
  Tag: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M10 3h8l3 3-9 9-6-6 4-4Zm-7 9 9 9-2 0H3v-7l0 0Z"
      />
    </svg>
  ),
  Milestone: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M4 3h16v2H4V3Zm2 4h12l-3 6H9L6 7Zm-2 8h16v2H4v-2Zm0 4h16v2H4v-2Z"
      />
    </svg>
  ),
  Share: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path fill="currentColor" d="M14 9V5l7 7-7 7v-4H6V9h8Z" />
    </svg>
  ),
  Community: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2a5 5 0 0 1 5 5v1h1a4 4 0 0 1 0 8h-1v1a5 5 0 0 1-10 0v-1H6a4 4 0 1 1 0-8h1V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v2h6V7a3 3 0 0 0-3-3Zm7 8H5a2 2 0 1 0 0 4h14a2 2 0 0 0 0-4Zm-4 6H9a3 3 0 0 0 6 0Z"
      />
    </svg>
  ),
};
