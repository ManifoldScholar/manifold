import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { Resource } from 'components/backend';
import { resourcesAPI } from 'api';
import { notificationActions } from 'actions';
import { connect } from 'react-redux';

class ResourceDetailContentContainer extends PureComponent {

  static displayName = "ResourceDetail.Content";
  static activeNavItem = "content";

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  initialState() {
    return {
      resourceKind: ""
    };
  }

  componentDidMount() {
    this.determineResourceKind();
  }

  setResourceKind(event) {
    const kind = event.target.value;
    this.setState({ resourceKind: kind })
  }

  determineResourceKind() {
    if (!this.props.resource.attributes.kind) return null;
    let kind = "";
    switch (this.props.resource.attributes.kind) {
      case "image":
      case "audio":
      case "pdf":
      case "document":
      case "spreadsheet":
      case "presentation":
      case "file":
        kind = "attachment";
        break;
      case "video":
        this.props.resource.attributes.externalType ? kind = "externalVideo" : kind = "attachment";
        break;
      case "link":
        kind = "link";
        break;
    }
    this.setState({resourceKind: kind});
  }

  renderResourceKindSelect() {
    return (
      <form className="form-secondary" style={{marginBottom: "40px"}}>
        <div className="form-input">
          <label>Kind</label>
          <div>
            <div className="form-select">
              <select
                onChange={event => this.setResourceKind(event)}
                value={this.state.resourceKind}
              >
                <option value="">Select a resource type...</option>
                <option value="attachment">Attachment</option>
                <option value="externalVideo">External Video</option>
                <option value="link">Link</option>
              </select>
              <i className="manicon manicon-caret-down"></i>
            </div>
          </div>
        </div>
      </form>
    );
  }

  render() {
    return (
      <section>
        <div>
          {this.renderResourceKindSelect()}
        </div>
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.resource}
          name="backend-resource-update"
          update={resourcesAPI.update}
          create={(model) => resourcesAPI.create(this.props.params.projectId, model) }
          className="form-secondary"
          debug={true}
        >
          <Resource.Form.KindAttributes resourceKind={this.state.resourceKind} />
          <Form.Save
            text="Save Resource"
          />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connect(
  ResourceDetailContentContainer.mapStateToProps
)(ResourceDetailContentContainer);
