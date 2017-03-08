import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import { Project as GlobalProject } from 'components/global';

export default class ProjectListItem extends PureComponent {

  static displayName = "Project.ListItem";

  static propTypes = {
    entity: PropTypes.object
  };

  renderProjectMakers(makers) {
    let output = null;
    if (makers && makers.length > 0) {
      output = (
        <div className="relations-list">
          {makers.map((maker, i) => {
            let nameList = maker.attributes.fullName;
            if (i > 0) nameList = ', ' + nameList;
            return nameList;
          })}
        </div>
      );
    }

    return output;
  }

  render() {
    const project = this.props.entity;
    const attr = project.attributes;
    return (
      <li key={project.id}>
        <Link to={`/backend/project/${project.id}`}>
          <header>
            <figure className="cover">
              {attr.coverUrl ? (<img src={attr.coverUrl} />) : <GlobalProject.Placeholder/>}
            </figure>
            <div className="meta">
              <h3 className="name">
                {attr.title}
                <span className="subtitle">
                    {attr.subtitle}
                  </span>
              </h3>
              {this.renderProjectMakers(project.relationships.creators)}
            </div>
          </header>
          <span className="label">
            Edit
          </span>
        </Link>
      </li>
    );

  }

}
