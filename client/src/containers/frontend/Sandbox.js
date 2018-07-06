import React, { Component } from "react";
import { connect } from "react-redux";

export class Sandbox extends Component {

  static mapStateToProps = state => {
    return {
    };
  };

  render() {
    return (
      <section>
        <div className="container page-content">
          <button className="button-bare-primary">button-bare-primary</button>
          <hr />
          <button className="button-trim-primary">button-trim-primary</button>
          <hr />
          <button className="button-primary">button-primary</button>
          <hr />
          <button className="button-primary dull">button-primary dull</button>
          <hr />
          <button className="button-icon-primary">
            <span>
              <i className="manicon manicon-books-on-shelf" aria-hidden="true" />
              button-icon-primary
            </span>
          </button>
          <hr />
          <button className="button-secondary">button-secondary</button>
          <hr />
          <button className="button-secondary-dull">button-secondary-dull</button>
          <hr />
          <button className="button-icon-secondary">
            <i className="manicon manicon-x small" aria-hidden="true" />
            button-icon-secondary
          </button>
          <hr />
          <button className="button-icon-secondary dull">
            <i className="manicon manicon-x small" aria-hidden="true" />
            button-icon-secondary dull
          </button>
          <hr />
          <a href="#" className="back-link-primary full">
            <div className="container flush">
              <i className="manicon manicon-arrow-left" aria-hidden="true" />
              back
              <span>back-link-primary</span>
            </div>
          </a>
          <hr />
          <a href="#" className="back-link-primary">
            <div className="container flush">
              <i className="manicon manicon-arrow-left" aria-hidden="true" />
              back
              <span>back-link-primary</span>
            </div>
          </a>
          <a href="#" className="back-link-secondary">
            <i className="manicon manicon-arrow-round-left" aria-hidden="true" />
            <div>
              <span className="back-text">back</span>
              <span className="project-title">back-link secondary</span>
            </div>
          </a>
          <hr />
        </div>
      </section>
    )
  }
}

export default connect(Sandbox.mapStateToProps)(Sandbox);
