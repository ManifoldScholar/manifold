import React, { Component } from "react";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Utility from "global/components/utility";
import Authorize from "hoc/authorize";

const helpLink = "https://manifoldapp.org/docs/";

export default class ProjectListPlaceholder extends Component {
  static displayName = "ProjectList.Placeholder";

  adminMessage() {
    const adminLink = lh.link("backendProjectCollections");

    return (
      <div className="centered-message">
        {
          "But it’s easy to create new project collections with Manifold. If you have backend access, "
        }
        <Link to={adminLink}>head to the backend</Link>
        {" and select "}
        <em>Add a New Project Collection</em>
        {
          ". For more help, you can learn about creating and publishing Manifold Project Collections "
        }
        <a href={helpLink} target="_blank" rel="noopener noreferrer">
          here
        </a>
        .
      </div>
    );
  }

  defaultMessage() {
    return <div className="centered-message">Please check back soon!</div>;
  }

  render() {
    return (
      <section className="bg-neutral05">
        <div className="container">
          <div className="project-list-placeholder">
            <header className="section-heading">
              <div className="main">
                <div className="body">
                  <h4 className="title">
                    <Authorize entity="projectCollection" ability="create">
                      Oh no. There are no project collections in this Manifold
                      library.
                    </Authorize>
                    <Authorize
                      entity="project"
                      ability="create"
                      successBehavior="hide"
                    >
                      There are no project collections in this Manifold library.
                    </Authorize>
                  </h4>
                </div>
              </div>
            </header>
            <Authorize entity="projectCollection" ability="create">
              {this.adminMessage()}
            </Authorize>
            <Authorize entity="project" ability="create" successBehavior="hide">
              {this.defaultMessage()}
            </Authorize>
            <Utility.IconComposer icon="BooksOnShelfColorUnique" />
            <Authorize entity="projectCollection" ability="create">
              <div className="button">
                <Link to={lh.link("backend")} className="button-icon-primary">
                  <span>{"Create a collection Now"}</span>
                </Link>
              </div>
            </Authorize>
          </div>
        </div>
      </section>
    );
  }
}
