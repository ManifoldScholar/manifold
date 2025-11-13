import { useRef, useCallback } from "react";
import { Navigate, useOutletContext, useNavigate } from "react-router-dom";
import lh from "helpers/linkHandler";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import ReadingGroupMembersList from "./List";
import withConfirmation from "hoc/withConfirmation";

function ReadingGroupsMembersContainer({ confirm }) {
  const { readingGroup, dispatch } = useOutletContext() || {};
  const navigate = useNavigate();
  const refreshRef = useRef(null);

  const { abilities, currentUserRole } = readingGroup?.attributes || {};
  const canUpdateGroup = abilities?.update;
  const userIsGroupMember = canUpdateGroup || currentUserRole !== "none";

  const membersRoute = lh.link("frontendReadingGroupMembers", readingGroup.id);

  const handleEditSuccess = useCallback(() => {
    navigate(membersRoute);
    if (refreshRef.current?.refresh) {
      refreshRef.current.refresh();
    }
  }, [navigate, membersRoute]);

  if (!userIsGroupMember) {
    return (
      <Navigate to={lh.link("frontendReadingGroupDetail", readingGroup.id)} />
    );
  }

  return (
    <>
      <ReadingGroupMembersList
        ref={refreshRef}
        readingGroup={readingGroup}
        dispatch={dispatch}
        confirm={confirm}
      />
      <OutletWithDrawer
        drawerProps={{
          closeUrl: membersRoute,
          context: "frontend",
          size: "wide",
          position: "overlay",
          lockScroll: "always"
        }}
        context={{
          readingGroup,
          confirm,
          dispatch,
          onEditSuccess: handleEditSuccess
        }}
      />
    </>
  );
}

export default withConfirmation(ReadingGroupsMembersContainer);
