// import { useState } from "react";
import { Outlet } from "react-router";
import useDialog from "@castiron/hooks/useDialog";
import Cart from "components/lti/Cart";
import Header from "components/lti/Header";
import { useBodyClass } from "hooks";
import { SelectionProvider } from "contexts";
import * as Styled from "./styles";

export default function LtiLayout() {
  useBodyClass("browse");

  const dialog = useDialog({ modal: false, dismissalMode: "explicit" });

  // TODO: replace with course info fetched from the LTI API once available.
  // const [courseInfo, setCourseInfo] = useState({ hasRG: null });
  // const needsSetup = courseInfo.hasRG === null;

  // const handleChoose = choice =>
  //   setCourseInfo(prev => ({ ...prev, hasRG: choice }));

  return (
    <SelectionProvider>
      <Styled.Wrapper>
        <Header dialog={dialog} />
        <Styled.Main $sidebarOpen={dialog.open}>
          <Styled.List>
            <Outlet />
          </Styled.List>
        </Styled.Main>
        <Cart dialog={dialog} />
      </Styled.Wrapper>
    </SelectionProvider>
  );
}
