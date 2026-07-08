import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import useDialog from "@castiron/hooks/useDialog";
import BodyClass from "hoc/BodyClass";
import HeadContent from "global/components/HeadContent";
import { SearchProvider } from "hooks/useSearch/context";
import { SelectionProvider } from "lti/contexts";
import Cart from "lti/components/Cart";
import Header from "lti/components/layout/Header";
import * as Styled from "./styles";

export default function LtiLayout() {
  const { t } = useTranslation();

  const dialog = useDialog({ modal: false, dismissalMode: "explicit" });

  return (
    <BodyClass className="browse">
      <SelectionProvider>
        <SearchProvider>
          <HeadContent title={t("lti.title")} appendDefaultTitle />
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
      </SelectionProvider>
    </BodyClass>
  );
}

LtiLayout.displayName = "Lti.LayoutContainer";
