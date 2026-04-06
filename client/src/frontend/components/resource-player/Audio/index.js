import React from "react";
import PropTypes from "prop-types";
import loadable from "@loadable/component";

const LoadableWaveform = loadable(() => import("./LoadableWaveform"));

export default function ResourcePlayerAudio({ resource }) {
  return <LoadableWaveform resource={resource} />;
}

ResourcePlayerAudio.displayName = "Resource.Player.Audio";

ResourcePlayerAudio.propTypes = {
  resource: PropTypes.object
};
