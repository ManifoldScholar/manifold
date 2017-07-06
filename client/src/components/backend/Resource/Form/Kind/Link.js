import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/backend';

export default class ResourceFormKindLink extends PureComponent {

  static displayName = "Resource.Form.Kind.Link";

  static propTypes = {
  };

  render() {
    return (
      <div className="form-section">
        <Form.TextInput
          label="Link URL"
          name="attributes[externalUrl]"
          placeholder="Enter link URL"
          {...this.props}
        />
      </div>
    );
  }

}
