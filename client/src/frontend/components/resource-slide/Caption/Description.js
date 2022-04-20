import React, { forwardRef } from "react";
import Collapse from "global/components/Collapse";
import useCollapseContext from "global/components/Collapse/useCollapseContext";
import * as Styled from "./styles";

const Description = forwardRef(({ content }, ref) => {
  const { visible } = useCollapseContext();

  return (
    <Styled.DescriptionWrapper>
      <Styled.DescriptionStatic
        $expanded={visible}
        dangerouslySetInnerHTML={content}
        ref={ref}
      />
      <Collapse.Content>
        <Styled.Description
          dangerouslySetInnerHTML={content}
          $expanded={visible}
        />
      </Collapse.Content>
    </Styled.DescriptionWrapper>
  );
});

export default Description;
