import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import useDialog from "@castiron/hooks/useDialog";
import Cart from "components/lti/Cart";
import Header from "components/lti/layout/Header";
import HeadContent from "components/global/HeadContent";
import { useBodyClass } from "hooks";
import { SelectionProvider } from "contexts";
import * as Styled from "./styles";

export default function LtiLayout() {
  const { t } = useTranslation();

  useBodyClass("browse");

  const dialog = useDialog({ modal: false, dismissalMode: "explicit" });

  return (
    <SelectionProvider>
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
    </SelectionProvider>
  );
}
