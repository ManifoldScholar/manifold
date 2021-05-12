import React, { Component } from "react";
import PropTypes from "prop-types";
import GridList from "../atomic/grid-list";
import Utility from "global/components/utility";
import get from "lodash/get";
import Header from "./Header";
import Filters from "./Filters";
import { CSSTransition } from "react-transition-group";
import ProjectGridItem from "../grid-list-items/ProjectGridItem";

export default class ProjectCollectionDetail extends Component {
  static displayName = "ProjectCollectionDetail";

  static propTypes = {
    projectCollection: PropTypes.object,
    authentication: PropTypes.object,
    dispatch: PropTypes.func,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func,
    projects: PropTypes.array,
    filterChangeHandler: PropTypes.func,
    initialState: PropTypes.object
  };

  get collectionAttributes() {
    return this.props.projectCollection.attributes;
  }

  render() {
    const projectCollection = this.props.projectCollection;
    if (!projectCollection) return null;

    return (
      <section key={projectCollection.id} className="bg-neutral05">
        <div className="container">
          <Header projectCollection={projectCollection} />
          <div className="project-collection-header__filter">
            <Filters
              filterChangeHandler={this.props.filterChangeHandler}
              initialState={this.props.initialState}
            />
          </div>
          <div className="entity-section-wrapper__details">
            <Utility.EntityCount
              pagination={this.props.pagination}
              singularUnit="project"
              pluralUnit="projects"
              countOnly
            />
          </div>

          <GridList
            authenticated={this.props.authentication.authenticated}
            favorites={get(this.props.authentication, "currentUser.favorites")}
            dispatch={this.props.dispatch}
            pagination={this.props.pagination}
            paginationClickHandler={this.props.paginationClickHandler}
          >
            {this.props.projects.map(project => {
              return (
                <CSSTransition
                  key={project.id}
                  enter
                  exit
                  timeout={{ enter: 250, exit: 250 }}
                >
                  <li className="grid-list__item--pos-rel">
                    <ProjectGridItem project={project} />
                  </li>
                </CSSTransition>
              );
            })}
          </GridList>
        </div>
      </section>
    );
  }
}
