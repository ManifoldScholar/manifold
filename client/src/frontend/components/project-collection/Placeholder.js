import React, { Component } from "react";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Utility from "global/components/utility";
import Authorize from "hoc/Authorize";
import ContentPlaceholder from "global/components/ContentPlaceholder";

export default class ProjectCollectionPlaceholder extends Component {
  static displayName = "ProjectCollection.Placeholder";

  get actions() {
    return [
      {
        children: (
          <Authorize entity="project" ability="create">
            <Link
              to={lh.link("backendProjectCollections")}
              className="button-tertiary"
            >
              Create a collection now
            </Link>
          </Authorize>
        )
      }
    ];
  }

  renderAdminMessage() {
    const helpLink =
      "https://manifoldscholar.github.io/manifold-docusaurus/docs/backend/project_collections";
    const adminLink = lh.link("backendProjectCollections");

    return (
      <p>
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
      </p>
    );
  }

  render() {
    return (
      <section className="bg-neutral05">
        <div className="container">
          <ContentPlaceholder.Wrapper context="frontend">
            <ContentPlaceholder.Title>
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
            </ContentPlaceholder.Title>
            <ContentPlaceholder.Body>
              <>
                <Authorize entity="project" ability="create">
                  {this.renderAdminMessage()}
                </Authorize>
                <Authorize
                  entity="project"
                  ability="create"
                  successBehavior="hide"
                >
                  <p>Please check back soon!</p>
                </Authorize>
                <Utility.IconComposer
                  icon="BooksOnShelfColorUnique"
                  size={205}
                />
              </>
            </ContentPlaceholder.Body>
            <ContentPlaceholder.Actions actions={this.actions} />
          </ContentPlaceholder.Wrapper>
        </div>
      </section>
    );
  }
}
