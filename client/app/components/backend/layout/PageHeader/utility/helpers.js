export const getTextLinks = ({ texts, pathname }) =>
  texts?.length
    ? texts?.map(t => ({
        label: t.label,
        path: `/backend/projects/text/${t.id}/analytics`,
        id: t.id,
        active: pathname?.includes(t.id)
      }))
    : null;

export const getIssueLinks = ({ issues, pathname }) =>
  issues?.length
    ? issues?.map(i => ({
        label: i.label,
        path: `/backend/projects/${i.id}/analytics`,
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

  if (action.path) {
    return {
      to: action.path
    };
  }

  return {
    as: "button",
    disabled: action.disabled,
    onClick: action.onClick,
    type: "button"
  };
};
