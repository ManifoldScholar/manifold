import { useTranslation } from "react-i18next";
import Pager from "components/lti/Pager";
import * as Styled from "./styles";

export default function BrowseList({ children, meta, noPagination = false }) {
  const { t } = useTranslation();

  const empty = noPagination ? !children : !meta?.pagination?.totalCount;

  return empty ? (
    <Styled.Empty>{t("lti.lists.empty")}</Styled.Empty>
  ) : (
    <>
      <Styled.List>{children}</Styled.List>
      <Pager meta={meta} />
    </>
  );
}
