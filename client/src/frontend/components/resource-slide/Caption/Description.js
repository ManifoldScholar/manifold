import React, { forwardRef } from "react";
import Collapse from "global/components/Collapse";
import useCollapseContext from "global/components/Collapse/useCollapseContext";
import * as Styled from "./styles";

const Description = forwardRef(({ content, isExpandable }, ref) => {
  const { visible } = useCollapseContext();

  return (
    <Styled.DescriptionWrapper>
      <Styled.DescriptionStatic
        $expanded={visible}
        dangerouslySetInnerHTML={content}
        ref={ref}
      />
      {isExpandable && (
        <Collapse.Content>
          <Styled.Description
            dangerouslySetInnerHTML={content}
            $expanded={visible}
          />
        </Collapse.Content>
      )}
    </Styled.DescriptionWrapper>
  );
});

export default Description;
