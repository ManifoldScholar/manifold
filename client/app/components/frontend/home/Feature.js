import Layout from "components/frontend/layout";
import { useAuthentication } from "hooks";

export default function HomeFeature({ features }) {
  const { authenticated } = useAuthentication();

  return features?.length ? (
    <Layout.Splash feature={features[0]} authenticated={authenticated} />
  ) : null;
}
