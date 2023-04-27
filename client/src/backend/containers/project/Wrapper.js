import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/Authorize";
import get from "lodash/get";
import IconComposer from "global/components/utility/IconComposer";
import { Link } from "react-router-dom";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import PageHeader from "backend/components/layout/PageHeader";

const { request, flush } = entityStoreActions;

export class ProjectWrapperContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      projectResponse: get(state.entityStore.responses, requests.beProject),
      project: select(requests.beProject, state.entityStore)
    };
  };

  static displayName = "Project.Wrapper";

  static propTypes = {
    projectResponse: PropTypes.object,
    project: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    route: PropTypes.object,
    location: PropTypes.object,
    t: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    this.fetchProject();
  }

  componentDidUpdate() {
    const {
      params: { id: nextId }
    } = this.props.match ?? {};
    const prevId = this.props.project?.id;
    if (nextId && prevId && nextId !== prevId) this.fetchProject();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beProject));
  }

  fetchProject = () => {
    const call = projectsAPI.show(this.props.match.params.id);
    const options = { force: true };
    const projectRequest = request(call, requests.beProject, options);
    this.props.dispatch(projectRequest);
  };

  doDestroy = () => {
    const call = projectsAPI.destroy(this.props.project.id);
    const options = { removes: this.props.project };
    const projectRequest = request(call, requests.beProjectDestroy, options);
    this.props.dispatch(projectRequest).promise.then(() => {
      this.redirectToDashboard();
    });
  };

  redirectToDashboard() {
    this.props.history.push(lh.link("backend"));
  }

  handleProjectDestroy = () => {
    const { t } = this.props;
    const heading = t("modals.delete_project");
    const message = t("modals.confirm_body");
    this.props.confirm(heading, message, this.doDestroy);
  };

  renderUtility(project) {
    const t = this.props.t;

    return (
      <>
        <div className="utility-button-group utility-button-group--inline">
          <Link
            to={lh.link(
              "frontendProjectDetail",
              this.props.project.attributes.slug
            )}
            className="utility-button"
          >
            <IconComposer
              icon="eyeOpen32"
              size={26}
              className="utility-button__icon"
            />
            <span className="utility-button__text">{t("actions.view")}</span>
          </Link>
          <Authorize entity={project} ability={"delete"}>
            <button
              onClick={this.handleProjectDestroy}
              className="utility-button"
            >
              <IconComposer
                icon="delete32"
                size={26}
                className="utility-button__icon"
              />
              <span className="utility-button__text">
                {t("actions.delete")}
              </span>
            </button>
          </Authorize>
        </div>
      </>
    );
  }

  renderRoutes() {
    const { project, projectResponse } = this.props;
    const refresh = this.fetchProject;
    const updateProject = projectsAPI.update;
    return childRoutes(this.props.route, {
      childProps: { refresh, updateProject, project, projectResponse }
    });
  }

  render() {
    if (!this.props.project) return null;
    const { project, t } = this.props;
    const secondaryLinks = navigation.project(project);
    const isJournalIssue = project.attributes.isJournalIssue;

    const backUrl = isJournalIssue
      ? lh.link("backendJournalIssues", project.relationships.journal.id)
      : null;
    const backLabel = isJournalIssue
      ? project.relationships.journal.attributes.title
      : null;

    const projectCrumb = [
      { to: lh.link("backend"), label: "Admin" },
      { to: lh.link("backendProjects"), label: "Projects" }
    ];

    const breadcrumbs = backUrl
      ? [{ to: backUrl, label: backLabel }]
      : projectCrumb;

    const subpage = location.pathname.split("/")[4]?.replace("-", "_");

    const issues = isJournalIssue
      ? project.relationships.journal?.relationships.recentJournalIssues?.map(
          i => ({
            title: i.attributes?.title,
            ...i.relationships?.project
          })
        )
      : null;

    const parentProps = isJournalIssue
      ? {
          parentTitle: project.relationships.journal.attributes.titleFormatted,
          parentSubtitle: project.relationships.journal.attributes.subtitle,
          issues,
          parentId: project.relationships.journal.id
        }
      : {};

    return (
      <div>
        <Authorize
          entity={project}
          failureFatalError={{
            detail: t("projects.unauthorized_edit")
          }}
          ability={["update", "manageResources"]}
        >
          {subpage && (
            <HeadContent
              title={`${t(`titles.${subpage}`)} | ${
                project.attributes.titlePlaintext
              } | ${t("common.admin")}`}
              appendDefaultTitle
            />
          )}
          <RedirectToFirstMatch
            from={lh.link("backendProject", project.id)}
            candidates={secondaryLinks}
          />
          <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
          <PageHeader
            type={isJournalIssue ? "issue" : "project"}
            title={project.attributes.titleFormatted}
            subtitle={project.attributes.subtitle}
            texts={project.relationships.texts}
            utility={this.renderUtility(project)}
            secondaryLinks={secondaryLinks}
            {...parentProps}
          />
          <Layout.BackendPanel
            sidebar={
              <Layout.SecondaryNav
                links={secondaryLinks}
                panel
                ariaLabel={t("projects.settings")}
              />
            }
          >
            <div>{this.renderRoutes()}</div>
          </Layout.BackendPanel>
        </Authorize>
      </div>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(ProjectWrapperContainer))
);
