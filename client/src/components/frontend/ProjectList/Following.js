import React, { Component } from "react";
import PropTypes from "prop-types";
import { ProjectList, Layout } from "components/frontend";
import size from "lodash/size";
import union from "lodash/union";

export default class ProjectListFollowing extends Component {
  static displayName = "ProjectList.Following";

  static propTypes = {
    followedProjects: PropTypes.array,
    authentication: PropTypes.object,
    subjects: PropTypes.array,
    handleUpdate: PropTypes.func,
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
        <div className="container">
          <header className="section-heading utility-right">
            <h4 className="title">
              <i className="manicon manicon-books-with-glasses" />
              {"Projects You're Following"}
            </h4>
            <div className="section-heading-utility-right">
              <ProjectList.Filters
                updateAction={this.props.handleUpdate}
                subjects={this.mapFavoritesToSubjects()}
              />
            </div>
          </header>
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
