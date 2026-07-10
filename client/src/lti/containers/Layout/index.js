import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import useDialog from "@castiron/hooks/useDialog";
import BodyClass from "hoc/BodyClass";
import HeadContent from "global/components/HeadContent";
import { SearchProvider } from "hooks/search/useSearchResults";
import { useDeepLinking } from "lti/contexts";
import Cart from "lti/components/Cart";
import Header from "lti/components/layout/Header";
import NotReady from "lti/components/layout/NotReady";
import * as Styled from "./styles";

export default function LtiLayout() {
  const { t } = useTranslation();
  const { status } = useDeepLinking();
  const dialog = useDialog({ modal: false, dismissalMode: "explicit" });

  return (
    <>
      <HeadContent title={t("lti.title")} appendDefaultTitle />
      <BodyClass className="browse">
        {status === "ready" ? (
          <SearchProvider>
            <Styled.Wrapper>
              <Header dialog={dialog} />
              <Styled.Main $cartOpen={dialog.open}>
                <Styled.List>
                  <Outlet />
                </Styled.List>
              </Styled.Main>
              <Cart dialog={dialog} />
            </Styled.Wrapper>
          </SearchProvider>
        ) : (
          <NotReady status={status} />
        )}
      </BodyClass>
    </>
  );
}

LtiLayout.displayName = "Lti.LayoutContainer";
