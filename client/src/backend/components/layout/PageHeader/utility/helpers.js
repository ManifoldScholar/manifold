import lh from "helpers/linkHandler";

export const getTextLinks = ({ texts, pathname }) =>
  texts?.length
    ? texts?.map(t => ({
        label: t.label,
        route: "backendTextAnalytics",
        id: t.id,
        active: pathname?.includes(t.id)
      }))
    : null;

export const getIssueLinks = ({ issues, pathname }) =>
  issues?.length
    ? issues?.map(i => ({
        label: i.label,
        route: "backendProjectAnalytics",
        id: i.id,
        active: pathname?.includes(i.id)
      }))
    : null;

export const getLinkOrButtonProps = action => {
  if (action.href) {
    return action.download
      ? { as: "a", href: action.href, download: true }
      : {
          as: "a",
          href: action.href,
          target: "_blank",
          re: "noopener noreferrer"
        };
  }

  if (action.route) {
    const params = action.routeParams
      ? action.routeParams
      : [action.slug, action.resourceSlug];

    return {
      to: lh.link(action.route, ...params)
    };
  }

  return { as: "button", disabled: action.disabled, onClick: action.onClick };
};
