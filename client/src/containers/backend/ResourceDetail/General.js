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
  }

  handleChangeKindClick() {
    // either redirect to pre-populated create or open kind picker
  }

  render() {
    const kind = this.props.resource.attributes.kind;
    return (
      <section>
        {
          kind ?
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
                  <div className="button"
                    onClick={this.handleChangeKindClick()}
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
          : null
        }
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.resource}
          name="backend-resource-update"
          update={resourcesAPI.update}
          create={(model) => resourcesAPI.create(this.props.params.projectId, model) }
          className="form-secondary"
        >
          <Resource.Form.KindAttributes kind={this.props.resource.attributes.kind} />
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
