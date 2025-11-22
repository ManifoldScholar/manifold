import { useMemo } from "react";
import PropTypes from "prop-types";
import Url from "url-parse";
import memoize from "lodash/memoize";
import config from "config";
import { Link } from "react-router-dom";

const urlFactory = memoize(url => new Url(url));

export default function UserLink({ url, className, children }) {
  const parsedUrl = useMemo(() => urlFactory(url), [url]);

  const isAbsoluteUrl = /^[a-z][a-z\d+.-]*:/.test(url);
  const isLocalUrl = !isAbsoluteUrl
    ? true
    : parsedUrl.hostname === config.services.client.domain;
  const renderUrl = isLocalUrl
    ? `${parsedUrl.pathname}${parsedUrl.query}${parsedUrl.hash}`
    : url;

  const LinkComponent = isLocalUrl ? Link : "a";

  const baseProps = { className };
  const linkProps = isLocalUrl
    ? { ...baseProps, to: renderUrl }
    : {
        ...baseProps,
        href: renderUrl,
        target: "_blank",
        rel: "noopener noreferrer"
      };

  return <LinkComponent {...linkProps}>{children}</LinkComponent>;
}

UserLink.displayName = "Helper.UserLink";

UserLink.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
};
