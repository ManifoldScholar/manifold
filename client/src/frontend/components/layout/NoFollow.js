import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import ContentPlaceholder from "global/components/ContentPlaceholder";
import IconComposer from "global/components/utility/IconComposer";
import { Translation } from 'react-i18next';

export default class NoFollow extends Component {
  static displayName = "Layout.NoFollow";

  static propTypes = {
    location: PropTypes.object
  };

  render() {
    return (
      <Translation>
        {t => (
          <section className="bg-neutral05">
            <div className="container">
              <ContentPlaceholder.Wrapper context="frontend">
                <ContentPlaceholder.Title>
                  {t(`not-following-anything`)}
                </ContentPlaceholder.Title>
                <ContentPlaceholder.Body>
                  <>
                    <p>
                      {t(`dont-fret`)}
                    </p>
                    <img
                      className="demo-animation"
                      src="/static/images/browse_no-follow-animation.gif"
                      alt={t(`follow-projects-alt`)}
                    />
                  </>
                </ContentPlaceholder.Body>
                <ContentPlaceholder.Actions>
                  <Link
                    to={lh.link("frontendProjectsAll")}
                    className="button-icon-primary"
                  >
                    <IconComposer
                      icon="projects64"
                      size={48}
                      iconClass="button-icon-primary__icon"
                    />
                    <span className="button-icon-primary__text">
                      See All Projects
                    </span>
                  </Link>
                </ContentPlaceholder.Actions>
              </ContentPlaceholder.Wrapper>
            </div>
          </section>
        )}
      </Translation>
    );
  }
}
