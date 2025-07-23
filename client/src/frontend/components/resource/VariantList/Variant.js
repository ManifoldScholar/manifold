import * as Styled from "./styles";

export default function Variant({ filename, url }) {
  return (
    <Styled.Item key={url}>
      <Styled.Link href={url} target="_blank" rel="noopener noreferrer">
        <Styled.LinkIcon icon="arrowDown16" size="default" />
        <Styled.LinkText>{filename}</Styled.LinkText>
      </Styled.Link>
    </Styled.Item>
  );
}
