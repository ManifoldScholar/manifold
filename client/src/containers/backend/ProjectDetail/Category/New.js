import React, { Component, PropTypes } from 'react';
import { Category } from 'components/backend';
import { Dialog } from 'components/backend';
import { withRouter } from 'react-router';
import { linkHelpers as lh } from 'routes';

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
    return lh.backendProjectTexts(this.props.params.id);
  }

  render() {

    return (
      <Dialog.Wrapper
        closeUrl={this.closeUrl()}
      >
        <header className="dialog-header-large">
          <h2>{'Create Category'}</h2>
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
