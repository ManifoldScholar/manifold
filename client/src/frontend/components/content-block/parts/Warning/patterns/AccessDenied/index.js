import React from "react";
import PropTypes from "prop-types";
import config from "config";
import get from "lodash/get";
import { useSettings } from "hooks";
import * as Styled from "./styles";

const TEXT_PATHS = {
  heading: [
    {
      prop: "entity",
      path: ["attributes"],
      name: "restrictedAccessHeading"
    },
    {
      prop: "settings",
      path: ["attributes", "general"],
      name: "restrictedAccessHeading"
    },
    {
      prop: "config",
      path: ["app", "locale", "notifications", "projectAuthorizationNotice"],
      name: "heading"
    }
  ],
  body: [
    {
      prop: "entity",
      path: ["attributes"],
      name: "restrictedAccessBody",
      show: "restrictedAccessBody"
    },
    {
      prop: "settings",
      path: ["attributes", "general"],
      name: "restrictedAccessBody",
      show: "restrictedAccessBody"
    },
    {
      prop: "config",
      path: ["app", "locale", "notifications", "projectAuthorizationNotice"],
      name: "body"
    }
  ]
};

function fetchTextPath(props, type) {
  const paths = get(TEXT_PATHS, type, []);

  let found = null;

  paths.forEach(({ prop, path, name, show }) => {
    if (found) return;

    const presence = get(props, [prop, ...path, name]);

    if (presence) {
      if (show) {
        found = get(props, [prop, ...path, show], presence);
      } else {
        found = presence;
      }
    }
  });

  return found;
}

function AccessDenied(props) {
  const settings = useSettings();
  const heading = fetchTextPath({ ...props, settings }, "heading");
  const body = fetchTextPath({ ...props, settings }, "body");

  return <Styled.Warning icon="stopSign64" heading={heading} body={body} />;
}

AccessDenied.displayName = "ContentBlock.Warning.AccessDenied";

AccessDenied.propTypes = {
  config: PropTypes.object,
  entity: PropTypes.shape({
    attributes: PropTypes.shape({
      restrictedAccessHeading: PropTypes.string,
      restrictedAccessBody: PropTypes.string,
      restrictedAccessBodyFormatted: PropTypes.string
    })
  })
};

AccessDenied.defaultProps = { config };

export default AccessDenied;
