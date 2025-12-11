import Layout from "frontend/components/layout";
import { useAuthentication } from "hooks";
import { commonActions } from "actions/helpers";
import { useDispatch } from "react-redux";

export default function HomeFeatureContainer({ features }) {
  const dispatch = useDispatch();
  const actions = commonActions(dispatch);

  const { authenticated } = useAuthentication();

  return features?.length ? (
    <Layout.Splash
      feature={features[0]}
      authenticated={authenticated}
      toggleSignInUpOverlay={actions?.toggleSignInUpOverlay}
    />
  ) : null;
}
