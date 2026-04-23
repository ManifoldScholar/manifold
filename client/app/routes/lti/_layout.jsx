// import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import useDialog from "@castiron/hooks/useDialog";
import Breadcrumbs from "components/lti/Breadcrumbs";
import SearchForm from "components/lti/SearchForm";
import SelectionSidebar from "components/lti/SelectionSidebar";
// import SetupChoice from "components/lti/SetupChoice";
import { useBodyClass } from "hooks";
import { SelectionProvider } from "contexts";
import * as Styled from "./styles";

export default function LtiLayout() {
  useBodyClass("browse");

  const location = useLocation();
  const sidebarDialog = useDialog({ modal: false, dismissalMode: "explicit" });

  // TODO: replace with course info fetched from the LTI API once available.
  // const [courseInfo, setCourseInfo] = useState({ hasRG: null });
  // const needsSetup = courseInfo.hasRG === null;

  const lastSegment = location.pathname.split("/").pop();
  const hideSearch = lastSegment === "lti" || lastSegment === "search";

  // const handleChoose = choice =>
  //   setCourseInfo(prev => ({ ...prev, hasRG: choice }));

  return (
    <SelectionProvider>
      <Styled.Wrapper $sidebarOpen={sidebarDialog.open}>
        <Styled.TopBar>
          <Breadcrumbs />
          {!hideSearch && <SearchForm size="sm" />}
        </Styled.TopBar>
        <Styled.Main>
          <Outlet />
        </Styled.Main>
        <SelectionSidebar dialog={sidebarDialog} />
      </Styled.Wrapper>
    </SelectionProvider>
  );
}
