import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import { getCollectableIcon } from "../helpers/resolvers";
import * as Styled from "./styles";

function Empty({ type }) {
  return (
    <Styled.WrapperEmpty>
      <Styled.CollectableEmpty>
        <IconComposer icon={getCollectableIcon(type)} size={32} />
        <Styled.Label>Drag here to add</Styled.Label>
      </Styled.CollectableEmpty>
    </Styled.WrapperEmpty>
  );
}

Empty.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCollectables.Empty";

Empty.propTypes = {
  type: PropTypes.string.isRequired
};

export default Empty;
