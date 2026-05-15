import { useTranslation } from "react-i18next";
import TextSection from "./TextSection";
import Message from "components/lti/atomics/Message";
import * as Styled from "./styles";

export default function TextSections({ collection, textTitle }) {
  const { t } = useTranslation();

  return (
    <Styled.Box>
      {collection?.length ? (
        <Styled.List>
          {collection.map(node => (
            <TextSection
              key={node.id}
              node={node}
              depth={0}
              textTitle={textTitle}
            />
          ))}
        </Styled.List>
      ) : (
        <Message>{t("lti.text_detail.toc_empty")}</Message>
      )}
    </Styled.Box>
  );
}
