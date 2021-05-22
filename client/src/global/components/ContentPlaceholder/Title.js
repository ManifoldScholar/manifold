import React from "react";
import IconComposer from "global/components/utility/IconComposer";

const PlaceholderTitle = ({ icon, iconProps, children }) => (
  <header className="content-placeholder__header">
    {icon && (
      <div className="content-placeholder__icon-wrapper">
        <IconComposer
          icon={icon}
          iconClass="content-placeholder__icon"
          size={48}
          {...iconProps}
        />
      </div>
    )}
    <h2 className="content-placeholder__title">{children}</h2>
  </header>
);

PlaceholderTitle.displayName = "ContentPlaceholder.Title";

export default PlaceholderTitle;
