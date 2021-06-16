import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import Schema from "global/components/schema";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import VolumeDetail from "../../components/volume/detail";
import volumeFixture from "../../../test/fixtures/entities/volume";
import issue from "../../../test/fixtures/entities/issue";
import uuid from "uuid";

// temporary
const vol = volumeFixture();
const issues = [];

for (let j = 0; j < 4; j++) {
  const iss = issue().data;
  iss.id = uuid.v1();
  vol.relationships.issues.push(iss);
}

const VolumeDetailContainer = ({
  volume,
  volumeResponse,
  settings,
  dispatch,
  fetchData,
  ...props
}) => {
  if (!volumeResponse) return null;
  if (volumeResponse.status === 401)
    return <Redirect to={lh.link("frontend")} />;
  if (!volume) return null;

  return (
    <div>
      <CheckFrontendMode debugLabel="VolumeDetail" isProjectHomePage />
      <HeadContent
        title={`\u201c${volume.attributes.titlePlaintext}\u201d on ${settings.attributes.general.installationName}`}
        description={volume.attributes.description}
      />
      <VolumeDetail volume={vol} />
      <Schema.Project
        attributes={volume.attributes}
        relationships={volume.relationships}
      />
    </div>
  );
};

VolumeDetailContainer.propTypes = {
  volume: PropTypes.object,
  volumeResponse: PropTypes.object,
  settings: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  fetchData: PropTypes.func
};

export default VolumeDetailContainer;
