import React, { Component, PropTypes } from 'react';
import { Category } from 'components/backend';
import { Dialog } from 'components/backend';
import { withRouter } from 'react-router';

class ProjectDetailCategoryNew extends Component {

  static displayName = "ProjectDetail.Category.New";
  static activeNavItem = "texts";

  static propTypes = {
    params: PropTypes.shape({ id: React.PropTypes.string }).isRequired,
    refresh: PropTypes.func,
    router: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
  }

  onSuccess() {
    this.props.refresh();
    this.props.router.push(this.closeUrl());
  }

  closeUrl() {
    return `/backend/project/${this.props.params.id}/texts`;
  }

  render() {

    return (
      <Dialog.Wrapper
        closeUrl={`/backend/project/${this.props.params.id}/texts`}
      >
        <header>
          <h2 className="heading-quaternary">{'Create Category'}</h2>
        </header>
        <Category.Form
          projectId={this.props.params.id}
          onSuccess={this.onSuccess}
        />
      </Dialog.Wrapper>
    );
  }
}

export default withRouter(ProjectDetailCategoryNew);
