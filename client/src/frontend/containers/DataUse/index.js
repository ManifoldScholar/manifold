import React from "react";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function DataUseContainer() {
  const settings = useFromStore("settings", "select");
  const header = settings?.attributes?.theme?.stringDataUseHeader;
  const body = settings?.attributes?.stringDataUseCopyFormatted;

  return (
    <div className="container">
      <Styled.Columns>
        <div>
          <Styled.Header>{header}</Styled.Header>
          <Styled.Body dangerouslySetInnerHTML={{ __html: body }} />
        </div>
        <Styled.ImagePlaceholder />
      </Styled.Columns>
    </div>
  );
}
