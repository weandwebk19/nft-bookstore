import React, { FunctionComponent, ReactElement } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

type ActiveLinkProps = {
  href: string;
  children: ReactElement;
  activeClass?: string;
};

const ActiveLink: FunctionComponent<ActiveLinkProps> = ({
  children,
  ...props
}) => {
  const { pathname } = useRouter();
  let className = children!.props.className || "";
  let _defaultClass = `${className}`;

  if (pathname === props.href) {
    className = `${className} active-link`;
  } else {
    className = _defaultClass;
  }

  return <Link {...props}>{React.cloneElement(children, { className })}</Link>;
};

export default ActiveLink;
