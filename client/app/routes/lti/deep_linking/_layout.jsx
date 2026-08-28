import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import useDialog from "@castiron/hooks/useDialog";
import HeadContent from "components/global/HeadContent";
import { useBodyClass } from "hooks";
import { DeepLinkingProvider, useDeepLinking } from "contexts";
import Cart from "components/lti/Cart";
import Header from "components/lti/layout/Header";
import NotReady from "components/lti/layout/NotReady";
import { ErrorBoundary } from "./ErrorBoundary";
import * as Styled from "./styles";

export { ErrorBoundary };

function Layout() {
  const { status } = useDeepLinking();
  const dialog = useDialog({ modal: false, dismissalMode: "explicit" });

  if (status !== "ready") return <NotReady status={status} />;

  return (
    <Styled.Wrapper>
      <Header dialog={dialog} />
      <Styled.Main $cartOpen={dialog.open}>
        <Styled.List>
          <Outlet />
        </Styled.List>
      </Styled.Main>
      <Cart dialog={dialog} />
    </Styled.Wrapper>
  );
}

export default function LtiLayoutRoute() {
  const { t } = useTranslation();

  useBodyClass("browse");

  return (
    <>
      <HeadContent title={t("lti.title")} appendDefaultTitle />
      <DeepLinkingProvider>
        <Layout />
      </DeepLinkingProvider>
    </>
  );
}
