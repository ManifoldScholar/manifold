import React, { PureComponent, PropTypes } from 'react';
import { Resource, Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { Resource as FrontendResource } from 'components/frontend';
import { resourcesAPI } from 'api';
import { notificationActions } from 'actions';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';

class ResourceDetailGeneralContainer extends PureComponent {

  static displayName = "ResourceDetail.General";
  static activeNavItem = "general";

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = this.initialState();
    this.setResourceKind = this.setResourceKind.bind(this);
    this.handleChangeKindClick = this.handleChangeKindClick.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  initialState() {
    return {
      newKind: null,
      changeKind: false
    };
  }

  setResourceKind(kind) {
    this.setState({
      newKind: kind
    });
  }

  handleChangeKindClick() {
    this.setState({
      changeKind: true
    });
  }

  handleSuccess() {
    this.setState(this.initialState);
  }

  renderKindPicker(kind) {
    return (
      <Resource.Form.KindPicker
        kind={kind}
        setKind={this.setResourceKind}
      />
    );
  }

  renderResourceKind() {
    const kind = this.props.resource.attributes.kind;
    return (
      <div className="resource-kind-picker form-secondary">
        <div className="form-input">
          <label>
            Kind
          </label>
          <ul>
            <li>
              <div className="button active">
                <figure>
                  <figcaption>
                    {capitalize(kind)}
                  </figcaption>
                  <div className={`resource-icon ${kind}`}>
                    <FrontendResource.Icon.Composer kind={kind}/>
                  </div>
                </figure>
              </div>
            </li>
            <li>
              <div
                className="button"
                onClick={this.handleChangeKindClick}
              >
                <figure>
                  <figcaption>
                    Change Kind
                  </figcaption>
                  <div className={`resource-icon change-kind`}>
                    <FrontendResource.Icon.Composer kind="file"/>
                  </div>
                </figure>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const renderKind = this.state.newKind ? this.state.newKind
      : this.props.resource.attributes.kind;
    return (
      <section>
        {this.state.changeKind ? this.renderKindPicker(renderKind) : this.renderResourceKind()}
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.resource}
          name="backend-resource-update"
          update={resourcesAPI.update}
          create={(model) => resourcesAPI.create(this.props.params.projectId, model) }
          onSuccess={this.handleSuccess}
          className="form-secondary"
        >
          <Resource.Form.KindAttributes kind={renderKind} />
          <Form.TextInput
            label="Title"
            name="attributes[title]"
            placeholder="Enter a title"
            {...this.props}
          />
          <Form.TextArea
            label="Description"
            name="attributes[description]"
            placeholder="Enter a description"
            {...this.props}
          />
          <Form.TextInput
            label="Caption"
            name="attributes[caption]"
            placeholder="Enter a short description"
            {...this.props}
          />
          <Form.Hidden
            name="attributes[kind]"
            value={renderKind}
          />
          <Form.Save
            text="Save Resource"
          />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connect(
  ResourceDetailGeneralContainer.mapStateToProps
)(ResourceDetailGeneralContainer);
