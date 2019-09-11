import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import ContentPlaceholder from "global/components/ContentPlaceholder";
import IconComposer from "global/components/utility/IconComposer";

export default class NoFollow extends Component {
  static displayName = "Layout.NoFollow";

  static propTypes = {
    location: PropTypes.object
  };

  render() {
    return (
      <section className="bg-neutral05">
        <div className="container">
          <ContentPlaceholder.Wrapper context="frontend">
            <ContentPlaceholder.Title>
              You’re not following any projects yet
            </ContentPlaceholder.Title>
            <ContentPlaceholder.Body>
              <>
                <p>
                  {"But don't fret, it's easy to start following projects. " +
                    "Just browse through the available projects, and when you find" +
                    " one you like, select the green plus symbol. When the green " +
                    "plus is replaced with a blue checkmark, you're done!"}
                </p>
                <img
                  className="demo-animation"
                  src="/static/images/browse_no-follow-animation.gif"
                  alt={
                    "A cursor icon hovers over a project thumbnail " +
                    "illustration, which depicts a stack of papers, a pencil," +
                    " a speech bubble, and a pair of glasses. The cursor" +
                    " clicks on a green plus icon to demonstrate how to" +
                    "follow a project. When clicked, the icon changes into a" +
                    " blue checkmark."
                  }
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
    );
  }
}
