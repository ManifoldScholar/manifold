import Layout from "frontend/components/layout";
import { useFromStore } from "hooks";
import { commonActions } from "actions/helpers";
import { useDispatch } from "react-redux";

export default function HomeFeatureContainer({ features }) {
  const dispatch = useDispatch();
  const actions = commonActions(dispatch);

  const authentication = useFromStore({ path: "authentication" });

  return features?.length ? (
    <Layout.Splash
      feature={features[0]}
      authenticated={authentication?.authenticated}
      toggleSignInUpOverlay={actions?.toggleSignInUpOverlay}
    />
  ) : null;
}
