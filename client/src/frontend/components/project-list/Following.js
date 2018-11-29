import React, { Component } from "react";
import PropTypes from "prop-types";
import Layout from "frontend/components/layout";
import ProjectList from "frontend/components/project-list";
import size from "lodash/size";
import union from "lodash/union";
import { Icon } from "global/components/svg";

export default class ProjectListFollowing extends Component {
  static displayName = "ProjectList.Following";

  static propTypes = {
    followedProjects: PropTypes.array,
    authentication: PropTypes.object,
    subjects: PropTypes.array,
    filterChangeHandler: PropTypes.func,
    dispatch: PropTypes.func
  };

  mapFavoritesToSubjects() {
    const subjects = this.props.subjects;
    const favorites = this.props.authentication.currentUser.favorites;
    if (!subjects || !favorites) return null;

    const subjectIds = Object.values(favorites).reduce((memo, favorite) => {
      return union(memo, favorite.attributes.subjectIds);
    }, []);

    return subjects.filter(subject => {
      return subjectIds.indexOf(subject.id) > -1;
    });
  }

  render() {
    const currentUser = this.props.authentication.currentUser;
    if (!currentUser) return null;
    if (!currentUser.favorites || size(currentUser.favorites) <= 0)
      return <Layout.NoFollow />;
    return (
      <section className="bg-neutral05">
        <div className="container project-list-container">
          <header className="section-heading">
            <div className="main">
              <i className="manicon" aria-hidden="true">
                <Icon.BooksWithGlasses size={54} />
              </i>
              <div className="body">
                <h4 className="title">{"Projects You’re Following"}</h4>
              </div>
            </div>
          </header>
          <ProjectList.Filters
            filterChangeHandler={this.props.filterChangeHandler}
            subjects={this.mapFavoritesToSubjects()}
          />
          {this.props.followedProjects ? (
            <ProjectList.Grid
              authenticated={this.props.authentication.authenticated}
              favorites={this.props.authentication.currentUser.favorites}
              dispatch={this.props.dispatch}
              projects={this.props.followedProjects}
            />
          ) : null}
        </div>
      </section>
    );
  }
}