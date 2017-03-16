import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import Kind from './Kind';

export default class KindAttributes extends PureComponent {

  static displayName = "Resource.KindAttributes";

  static propTypes = {
    dirtyModel: PropTypes.object
  };

  render() {
    switch (this.props.dirtyModel.attributes.kind) {
      case "attachment":
        return <Kind.Attachment {...this.props} />
        break;
      case "link":
        return <Kind.Link {...this.props} />
        break;
      default:
        return null;
        break;
    }
  }

}
