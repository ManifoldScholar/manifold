import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import Authorize from "hoc/Authorize";
import { getLinkOrButtonProps } from "../helpers";
import { useTranslation } from "react-i18next";

export default function ActionButton({ iconSize, action, entity }) {
  const { t } = useTranslation();

  const { as, ...linkOrButtonProps } = getLinkOrButtonProps(action);

  const isProjectCollection = entity === "projectCollection";
  const iconClasses = classNames("utility-button__icon", {
    "utility-button__icon--highlight": isProjectCollection
  });

  const Tag = as ?? Link;

  const item = (
    <Tag {...linkOrButtonProps} className="utility-button">
      <IconComposer
        icon={action.icon}
        size={iconSize ?? 26}
        className={iconClasses}
      />
      <span className="utility-button__text">{t(action.label)}</span>
    </Tag>
  );

  if (action.authorize) {
    return (
      <Authorize key={action.label} entity={entity} ability={action.authorize}>
        {item}
      </Authorize>
    );
  }

  return item;
}
