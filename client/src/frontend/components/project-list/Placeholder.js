import React from "react";
import ContentPlaceholder from "global/components/ContentPlaceholder";
import Authorize from "hoc/authorize";
import Utility from "global/components/utility";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export default class ProjectListPlaceholder extends React.PureComponent {
  get actions() {
    return [
      {
        children: (
          <Authorize entity="project" ability="create">
            <Link to={lh.link("backendProjects")} className="button-tertiary">
              Publish a Project Now
            </Link>
          </Authorize>
        )
      }
    ];
  }

  renderAdminMessage() {
    const helpLink =
      "https://manifoldscholar.github.io/manifold-docusaurus/docs/backend/projects";
    return (
      <p>
        {
          "But it’s easy to create and publish projects with Manifold. If you have backend access, "
        }
        <Link to={lh.link("backend")}>head to the backend</Link>
        {" and select "}
        <em>Add a New Project</em>
        {
          ". For more help, you can learn about creating and publishing Manifold Projects "
        }
        <a href={helpLink}>here</a>.
      </p>
    );
  }

  render() {
    const wrapperStyle = {
      paddingTop: 50,
      paddingBottom: 50
    };

    return (
      <section className="bg-neutral05" style={wrapperStyle}>
        <div className="container">
          <ContentPlaceholder.Wrapper context="frontend">
            <ContentPlaceholder.Title>
              <Authorize entity="projectCollection" ability="create">
                Uh-oh. This Manifold library is empty.
              </Authorize>
              <Authorize
                entity="project"
                ability="create"
                successBehavior="hide"
              >
                This Manifold library is empty.
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
