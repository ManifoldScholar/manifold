import React from "react";
import { Translation } from 'react-i18next';

const helpLink = "https://manifoldapp.org/docs/";

const PlaceholderActions = ({ children }) => (
  <Translation>
    {t => (
      <div className="content-placeholder__actions">
        {children}
        <div className="content-placeholder__ext-link-wrapper">
          <a
            href={helpLink}
            target="_blank"
            rel="noopener noreferrer"
            className="content-placeholder__ext-link"
          >
            {t(`visit-our-documentation`)}
          </a>
        </div>
      </div>
    )}
  </Translation>
);

PlaceholderActions.displayName = "ContentPlaceholder.Actions";

export default PlaceholderActions;
