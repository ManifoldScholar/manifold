import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { useNavigate, useLocation } from "react-router-dom-v5-compat";
import { useParams } from "react-router-dom";

export default function ProjectCollectionsRedirect() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const detailRegex = /^\/projects\/project-collection\/([A-Za-z0-9-]+)/;

  const redirectPath = detailRegex.test(location.pathname)
    ? lh.link("frontendProjectCollection", params.id)
    : lh.link("frontendProjectCollections");

  return navigate({ ...location, pathname: redirectPath });
}
