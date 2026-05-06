/// <reference types="vite/client" />

// React 19 removed the global JSX namespace — restore it so components
// can still use `JSX.Element` as a return-type annotation.
declare namespace JSX {
  type Element = import('react').JSX.Element;
  type IntrinsicElements = import('react').JSX.IntrinsicElements;
  type ElementClass = import('react').Component;
}
