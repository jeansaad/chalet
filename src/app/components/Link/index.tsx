import * as React from "react";
import { IMonitor, IProxy } from "../../Store";

function href(id: string) {
  const { protocol, hostname } = window.location;
  if (/chalet\./.test(hostname)) {
    // Accessed using chalet.tld
    const tld = hostname.split(".").slice(-1)[0];
    return `${protocol}//${id}.${tld}`;
  } else {
    // Accessed using localhost
    return `/${id}`;
  }
}

interface IProps {
  id: string;
  children?: React.ReactNode;
}

function Link({ id, children }: IProps) {
  return (
    <a href={href(id)} target="_blank" onClick={e => e.stopPropagation()}>
      {children ?? id}
    </a>
  );
}

export default Link;
