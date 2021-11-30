import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import IconComputed from "global/components/icon-computed";
import * as Styled from "./styles";

function Icon({ resourceish }) {
  const {
    type,
    attributes: { kind }
  } = resourceish;

  if (type !== "resources" && type !== "resourceCollections") return null;

  const as =
    type === "resources" ? IconComputed.Resource : Utility.IconComposer;
  const icon = type === "resources" ? kind : "resourceCollection64";

  return (
    <Styled.Wrapper>
      <Styled.Icon as={as} icon={icon} size={56} />
    </Styled.Wrapper>
  );
}

Icon.displayName = "Resourceish.Thumbnail.Icon";

Icon.propTypes = {
  resourceish: PropTypes.object.isRequired
};

export default Icon;
