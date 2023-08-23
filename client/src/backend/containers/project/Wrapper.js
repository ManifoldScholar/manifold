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
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "./breadcrumbs";
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

  get utility() {
    return [
      {
        label: "actions.view",
        route: "frontendProjectDetail",
        slug: this.props.project.attributes.slug,
        icon: "eyeOpen32"
      },
      {
        label: "actions.delete",
        authorize: "delete",
        icon: "delete32",
        onClick: this.handleProjectDestroy
      }
    ];
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

    const breadcrumbs = getBreadcrumbs(
      project,
      this.props.location.state,
      isJournalIssue,
      t
    );

    const subpage = location.pathname.split("/")[4]?.replace("-", "_");

    const parentProps = isJournalIssue
      ? {
          parentTitle: project.relationships.journal.attributes.titleFormatted,
          parentSubtitle: project.relationships.journal.attributes.subtitle,
          parentId: project.relationships.journal.id,
          issues: project.attributes.journalIssuesNav
        }
      : {};

    return (
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
          route={"backendProject"}
          id={project.id}
          slug={project.attributes.slug}
          candidates={secondaryLinks}
          state={this.props.location.state}
        />
        <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
        <PageHeader
          type={isJournalIssue ? "issue" : "project"}
          title={project.attributes.titleFormatted}
          subtitle={project.attributes.subtitle}
          texts={project.attributes.textsNav}
          actions={this.utility}
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
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(ProjectWrapperContainer))
);
