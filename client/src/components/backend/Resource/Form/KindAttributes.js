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
      case "image":
        return <Kind.Image {...this.props} />
        break
      case "video":
        return <Kind.Video {...this.props} />
        break
      default:
        return null
        break;
    }
  }

}
