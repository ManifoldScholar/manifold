import React, { Component, PropTypes } from 'react';
import { Category } from 'components/backend';
import { Dialog } from 'components/backend';
import { withRouter } from 'react-router-dom';

export default class ProjectDetailCategoryNew extends Component {

  static displayName = "ProjectDetail.Category.New";

  static propTypes = {
    project: PropTypes.object.isRequired,
    refresh: PropTypes.func,
    triggerClose: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
  }

  onSuccess() {
    this.props.refresh();
    if (this.props.triggerClose) this.props.triggerClose();
  }

  render() {
    return (
      <div>
        <header className="dialog-header-large">
          <h2>{'Create Category'}</h2>
        </header>
        <Category.Form
          projectId={this.props.project.id}
          onSuccess={this.onSuccess}
        />
      </div>
    );
  }
}
