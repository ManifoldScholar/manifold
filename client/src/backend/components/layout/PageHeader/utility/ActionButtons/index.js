import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import Authorize from "hoc/Authorize";
import { getLinkOrButtonProps } from "../helpers";
import { useTranslation } from "react-i18next";

export default function ActionButtons({ actions, entity }) {
  const { t } = useTranslation();

  const renderItem = action => {
    const linkOrButtonProps = getLinkOrButtonProps(action);

    const isProjectCollection = entity === "projectCollection";
    const iconClasses = classNames("utility-button__icon", {
      "utility-button__icon--highlight": isProjectCollection
    });

    const Tag = linkOrButtonProps.as ?? Link;

    const item = (
      <Tag key={action.label} {...linkOrButtonProps} className="utility-button">
        <IconComposer icon={action.icon} size={26} className={iconClasses} />
        <span className="utility-button__text">{t(action.label)}</span>
      </Tag>
    );

    if (action.authorize) {
      return (
        <Authorize
          key={action.label}
          entity={entity}
          ability={action.authorize}
        >
          {item}
        </Authorize>
      );
    }

    return item;
  };

  return (
    <div className="utility-button-group utility-button-group--inline">
      {actions.map(action => renderItem(action))}
    </div>
  );
}
