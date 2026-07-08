import { useTranslation } from "react-i18next";
import Message from "lti/components/atomics/Message";
import * as Styled from "./styles";

export default function NotReady({ status }) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      {status === "loading" ? (
        <Message title={t("lti.status.loading")} noBorder />
      ) : (
        <Message title={t("lti.status.invalid_heading")} noBorder>
          <p>{t("lti.status.invalid_body")}</p>
        </Message>
      )}
    </Styled.Wrapper>
  );
}

NotReady.displayName = "Lti.NotReady";
