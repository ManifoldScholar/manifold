import { useMemo } from "react";
import PropTypes from "prop-types";
import Url from "url-parse";
import memoize from "lodash/memoize";
import config from "config";
import { Link } from "react-router-dom-v5-compat";

const urlFactory = memoize(url => new Url(url));

export default function UserLink({ url, className, children }) {
  const parsedUrl = useMemo(() => urlFactory(url), [url]);

  const isAbsoluteUrl = useMemo(() => /^[a-z][a-z\d+.-]*:/.test(url), [url]);

  const isLocalUrl = useMemo(() => {
    if (!isAbsoluteUrl) return true;
    return parsedUrl.hostname === config.services.client.domain;
  }, [isAbsoluteUrl, parsedUrl.hostname]);

  const renderUrl = useMemo(() => {
    if (isLocalUrl)
      return `${parsedUrl.pathname}${parsedUrl.query}${parsedUrl.hash}`;
    return url;
  }, [isLocalUrl, parsedUrl.pathname, parsedUrl.query, parsedUrl.hash, url]);

  const LinkComponent = isLocalUrl ? Link : "a";

  const linkProps = useMemo(() => {
    const baseProps = { className };
    if (isLocalUrl) {
      return { ...baseProps, to: renderUrl };
    }
    return {
      ...baseProps,
      href: renderUrl,
      target: "_blank",
      rel: "noopener noreferrer"
    };
  }, [className, isLocalUrl, renderUrl]);

  return <LinkComponent {...linkProps}>{children}</LinkComponent>;
}

UserLink.displayName = "Helper.UserLink";

UserLink.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
};
