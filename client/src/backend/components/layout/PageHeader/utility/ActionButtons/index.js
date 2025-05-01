import React from "react";
import Button from "./Button";

export default function ActionButtons({ actions, entity, iconSize }) {
  return (
    <div className="utility-button-group utility-button-group--inline">
      {actions.map((action) => (
        <Button
          key={action.label}
          action={action}
          entity={entity}
          iconSize={iconSize}
        />
      ))}
    </div>
  );
}
