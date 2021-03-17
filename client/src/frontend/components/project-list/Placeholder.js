import React from "react";
import ContentPlaceholder from "global/components/ContentPlaceholder";
import Authorize from "hoc/authorize";
import Utility from "global/components/utility";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { Translation } from "react-i18next";

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
      <Translation>
        {t => (
          <p>
            {t(`but-its-easy`)}
            <Link to={lh.link("backend")}>{t(`head-to-the-backend`)}</Link>
            {t(`and-select`)}
            <em>{t(`add-a-new-project`)}</em>
            {t(`for-more-help`)}
            <a href={helpLink}>{t(`here`)}</a>.
          </p>
        )}
      </Translation>
    );
  }

  render() {
    const wrapperStyle = {
      paddingTop: 50,
      paddingBottom: 50
    };

    return (
      <Translation>
        {t => (
          <section className="bg-neutral05" style={wrapperStyle}>
            <div className="container">
              <ContentPlaceholder.Wrapper context="frontend">
                <ContentPlaceholder.Title>
                  <Authorize entity="projectCollection" ability="create">
                    {t(`uh-oh-library-empty`)}
                  </Authorize>
                  <Authorize
                    entity="project"
                    ability="create"
                    successBehavior="hide"
                  >
                    {t(`library-empty`)}
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
                      <p>{t(`check-back-soon`)}</p>
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
        )}
      </Translation>
    );
  }
}
