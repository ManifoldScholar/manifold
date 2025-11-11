import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function DataUseContainer() {
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  const header = settings?.attributes?.theme?.stringDataUseHeader;
  const body = settings?.attributes?.stringDataUseCopyFormatted;

  return (
    <div className="container">
      <Styled.Wrapper>
        <Styled.Header>{header}</Styled.Header>
        <Styled.Body dangerouslySetInnerHTML={{ __html: body }} />
      </Styled.Wrapper>
    </div>
  );
}
