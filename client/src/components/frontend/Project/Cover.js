import React, { Component, PropTypes } from 'react';
import { Project as GlobalProject } from 'components/global';


export default class ProjectCover extends Component {

    static displayName = "Project.Cover";

    static propTypes = {
        project: PropTypes.object
    };

    render() {
        const project = this.props.project;

        let cover;
        if (project.attributes.avatarStyles.small) {
            cover = (
                <img src={project.attributes.avatarStyles.small}
                     alt={`Click to view ${this.props.project.attributes.title}`}
                />
            );
        } else {
            cover = <GlobalProject.Placeholder />;
        }

        return (
            <div>{cover}</div>
        );
    }
}
