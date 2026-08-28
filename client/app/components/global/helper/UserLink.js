import PropTypes from "prop-types";
import { Link } from "react-router";

const ABSOLUTE_URL = /^[a-z][a-z\d+.-]*:/i;
const BARE_HOST = /^[\w-]+(\.[\w-]+)+(?::\d+)?(\/|$|\?|#)/;

/**
 * Renders a user-entered URL (action callouts, page links, etc.) as a router
 * <Link> when it points at this site and as an external <a> otherwise.
 *
 * Relative input is resolved here rather than by the URL parser: the parser
 * resolves relative strings against `window.location` in the browser and
 * against nothing on the server, which produced different hrefs on each side
 * and a hydration mismatch.
 */
function resolve(url) {
  if (ABSOLUTE_URL.test(url)) {
    const parsed = new URL(url);
    const isLocal = parsed.host === import.meta.env.VITE_DOMAIN;
    return isLocal
      ? {
          local: true,
          href: `${parsed.pathname}${parsed.search}${parsed.hash}`
        }
      : { local: false, href: url };
  }
  if (url.startsWith("/")) return { local: true, href: url };
  if (BARE_HOST.test(url)) return { local: false, href: `https://${url}` };
  return { local: true, href: `/${url}` };
}

export default function UserLink({ url, className, children }) {
  const { local, href } = resolve(url);

  if (local) {
    return (
      <Link className={className} to={href}>
        {children}
      </Link>
    );
  }

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

UserLink.displayName = "Helper.UserLink";

UserLink.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
};
