import React, { Component } from "react";
import PropTypes from "prop-types";
import ButtonNavigation from "./ButtonNavigation";

export default class NoFollow extends Component {
  static displayName = "Layout.NoFollow";

  static propTypes = {
    location: PropTypes.object
  };

  render() {
    return (
      <div>
        <section className="bg-neutral05">
          <div className="container flush-bottom">
            <section className="no-follow">
              <h3 className="heading-primary">
                {"You're not following any projects yet"}
              </h3>
              <p>
                {"But don't fret, it's easy to start following projects. " +
                  "Just browse through the available projects, and when you find" +
                  " one you like, select the green plus symbol. When the green " +
                  "plus is replaced with a blue checkmark, you're done!"}
              </p>
              <figure className="demo-animation">
                <img
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
              </figure>
            </section>
          </div>
        </section>
        <ButtonNavigation grayBg showFollowing={false} />
      </div>
    );
  }
}
