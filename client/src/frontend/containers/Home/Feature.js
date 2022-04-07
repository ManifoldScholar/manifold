import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Layout from "frontend/components/layout";
import { featuresAPI } from "api";
import { useFetch } from "hooks";
import { commonActions } from "actions/helpers";
import { useDispatch } from "react-redux";

export default function HomeFeatureContainer({ authentication }) {
  const filters = useMemo(() => ({ home: true }), []);
  const { data: features } = useFetch({
    request: [featuresAPI.index, filters],
    withAuthDependency: true
  });

  const dispatch = useDispatch();
  const actions = commonActions(dispatch);

  return features?.length ? (
    <Layout.Splash
      feature={features[0]}
      authenticated={authentication?.authenticated}
      toggleSignInUpOverlay={actions?.toggleSignInUpOverlay}
    />
  ) : null;
}

HomeFeatureContainer.propTypes = {
  authentication: PropTypes.object
};
