import { useTranslation } from "react-i18next";
import TocNode from "components/lti/TocNode";
import * as Styled from "./styles";

export default function Toc({ toc, textTitle }) {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t("lti.text_detail.toc_heading")}</h2>
      {toc?.length ? (
        <Styled.Toc>
          <Styled.TocList>
            {toc.map(node => (
              <TocNode
                key={node.id}
                node={node}
                depth={0}
                textTitle={textTitle}
              />
            ))}
          </Styled.TocList>
        </Styled.Toc>
      ) : (
        <Styled.TocEmpty>{t("lti.text_detail.toc_empty")}</Styled.TocEmpty>
      )}
    </>
  );
}
