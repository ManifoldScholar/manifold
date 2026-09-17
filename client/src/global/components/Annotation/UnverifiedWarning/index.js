import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import { useFromStore } from "hooks";
import { uiVisibilityActions } from "actions";
import * as Styled from "./styles";

/**
 * Banner shown in the reader annotation drawers to signed-in users whose
 * account is neither trusted nor established. Such users cannot comment,
 * annotate publicly, or see public reading groups in the picker until they
 * verify their email.
 */
export default function UnverifiedWarning() {
  const dispatch = useDispatch();
  const authentication = useFromStore({ path: "authentication" });

  if (!authentication?.authenticated) return null;

  const { trusted, established } = authentication.currentUser.attributes;

  if (trusted || established) return null;

  const onProfileClick = () =>
    dispatch(uiVisibilityActions.visibilityShow("signInUpOverlay"));

  return (
    <Styled.Wrapper>
      <Trans
        i18nKey="messages.unverified_to_comment"
        components={[
          <Styled.ProfileButton type="button" onClick={onProfileClick} />
        ]}
      />
    </Styled.Wrapper>
  );
}

UnverifiedWarning.displayName = "Annotation.UnverifiedWarning";
