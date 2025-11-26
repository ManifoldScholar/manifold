import { useRef } from "react";
import { Navigate, useOutletContext, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import lh from "helpers/linkHandler";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import ReadingGroupMembersList from "./List";
import withConfirmation from "hoc/withConfirmation";

function ReadingGroupsMembersContainer({ confirm }) {
  const { readingGroup } = useOutletContext() || {};
  const navigate = useNavigate();
  const refreshRef = useRef(null);
  const dispatch = useDispatch();

  const { abilities, currentUserRole } = readingGroup?.attributes || {};
  const canUpdateGroup = abilities?.update;
  const userIsGroupMember = canUpdateGroup || currentUserRole !== "none";

  const membersRoute = lh.link("frontendReadingGroupMembers", readingGroup.id);

  const handleEditSuccess = () => {
    navigate(membersRoute);
    if (refreshRef.current?.refresh) {
      refreshRef.current.refresh();
    }
  };

  if (!userIsGroupMember) {
    const redirectUrl = lh.link("frontendReadingGroupDetail", readingGroup.id);

    if (__SERVER__) {
      throw new Response(null, {
        status: 302,
        headers: { Location: redirectUrl }
      });
    }

    return <Navigate to={redirectUrl} replace />;
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
          onEditSuccess: handleEditSuccess
        }}
      />
    </>
  );
}

export default withConfirmation(ReadingGroupsMembersContainer);
