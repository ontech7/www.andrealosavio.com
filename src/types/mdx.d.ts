import type * as React from "react";

declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";

  export default function MDXContent(props: MDXProps): React.JSX.Element;
}
