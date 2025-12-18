import { routerContext } from "app/contexts";
import { useTranslation } from "react-i18next";
import HeadContent from "global/components/HeadContent";
import * as Styled from "./styles";

export { shouldRevalidate } from "app/routes/utility/loaders/shouldRevalidate";

export const loader = async ({ context }) => {
  const { settings } = context.get(routerContext);
  return { settings };
};

export default function DataUseRoute({ loaderData }) {
  const { settings } = loaderData || {};
  const header = settings?.attributes?.theme?.stringDataUseHeader;
  const body = settings?.attributes?.stringDataUseCopyFormatted;

  const { t } = useTranslation();

  return (
    <>
      <HeadContent title={t("titles.data_use")} appendDefaultTitle />
      <div className="container">
        <Styled.Wrapper>
          <Styled.Header>{header}</Styled.Header>
          <Styled.Body dangerouslySetInnerHTML={{ __html: body }} />
        </Styled.Wrapper>
      </div>
    </>
  );
}
