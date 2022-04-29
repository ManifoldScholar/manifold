import React from "react";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

const PlaceholderTitle = ({ icon, iconProps, children }) => (
  <Styled.Header>
    {icon && (
      <Styled.IconWrapper>
        <IconComposer icon={icon} size={48} {...iconProps} />
      </Styled.IconWrapper>
    )}
    <Styled.Title>{children}</Styled.Title>
  </Styled.Header>
);

PlaceholderTitle.displayName = "Global.Entity.CollectionPlaceholder.Title";

export default PlaceholderTitle;
