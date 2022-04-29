import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Action, { actionProps } from "./Action";
import * as Styled from "./styles";

const DOCS_URL = "https://manifoldscholar.github.io/manifold-docusaurus/docs";

const PlaceholderActions = ({ actions = [] }) => {
  const { t } = useTranslation();

  const allActions = [
    ...actions,
    {
      title: t("placeholders.documentation_button_label"),
      linkProps: {
        href: DOCS_URL,
        target: "_blank",
        rel: "noopener norefferer"
      }
    }
  ];

  return (
    <Styled.Actions>
      {allActions.map((action, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Action key={index} {...action} />
      ))}
    </Styled.Actions>
  );
};

PlaceholderActions.displayName = "Global.Entity.CollectionPlaceholder.Actions";

PlaceholderActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape(actionProps))
};

export default PlaceholderActions;
