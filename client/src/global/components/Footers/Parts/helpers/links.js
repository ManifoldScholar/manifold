import lh from "helpers/linkHandler";
import compact from "lodash/compact";

function visiblePages(pages = []) {
  return pages.filter(p => {
    return p.attributes.showInFooter && !p.attributes.hidden;
  });
}

function sortedPages(pages = []) {
  const out = [];
  pages.map(page => {
    return page.attributes.purpose === "supplemental_content"
      ? out.unshift(page)
      : out.push(page);
  });
  return out;
}

export function manifoldLinks() {
  const links = [
    {
      to: lh.link("frontendProjectsAll"),
      title: "Projects"
    },
    {
      to: lh.link("frontend"),
      title: "Home"
    }
  ];
  return links;
}

export function pageLinks({ pages }) {
  const collection = sortedPages(visiblePages(pages || []));
  return collection.map(page => {
    const {
      navTitle,
      title: pageTitle,
      openInNewTab,
      slug,
      isExternalLink,
      externalLink
    } = page.attributes;
    const title = navTitle || pageTitle;
    const to = isExternalLink ? null : lh.link("frontendPage", slug);
    const href = isExternalLink ? externalLink : null;
    return { title, to, openInNewTab, href };
  });
}

export function authenticationLink({
  authentication: { authenticated },
  commonActions
}) {
  if (authenticated)
    return {
      onClick: commonActions.logout,
      title: "Log Out"
    };
  return {
    onClick: commonActions.toggleSignInUpOverlay,
    title: "Log In"
  };
}

export function emailLink({ settings }) {
  if (!settings || !settings.attributes.general.contactEmail) return null;
  return {
    title: "Email",
    to: lh.link("frontendContact"),
    icon: "socialEmail32"
  };
}

export function socialLinks({ settings }) {
  return compact([emailLink({ settings })]);
}

export default function defaultLinks(props) {
  const { pages } = props;
  const links = [authenticationLink(props)];
  return links
    .concat(manifoldLinks())
    .concat(pageLinks({ pages }))
    .concat(socialLinks(props));
}
