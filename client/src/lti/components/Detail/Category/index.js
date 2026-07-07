import Header from "./Header";
import SearchResult from "lti/components/Search/Results/Result";
import TextSections from "./patterns/TextSections";
import * as Styled from "./styles";

export default function Category({ type, collection, textTitle }) {
  if (!collection?.length && !textTitle) return null;

  return (
    <Styled.Wrapper>
      <Header type={type} />
      {type === "textSection" ? (
        <TextSections collection={collection} textTitle={textTitle} />
      ) : (
        collection.map(item => (
          <SearchResult key={item.id} entity={item} type={type} />
        ))
      )}
    </Styled.Wrapper>
  );
}
