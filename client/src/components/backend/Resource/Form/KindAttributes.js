import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import Kind from './Kind';

export default class KindAttributes extends PureComponent {

  static displayName = "Resource.KindAttributes";

  static propTypes = {
    dirtyModel: PropTypes.object
  };

  render() {
    switch (this.props.resourceKind) {
      case "image":
        return <Kind.Image {...this.props}/>;
        break;
      case "video":
        return <Kind.Video {...this.props}/>;
        break;
      case "audio":
        return <Kind.Audio {...this.props}/>;
        break;
      case "interactive":
        return <Kind.Interactive {...this.props}/>;
        break;
      case "link":
        return <Kind.Link {...this.props}/>;
        break;
      case "spreadsheet":
      case "document":
      case "presentation":
      case "pdf":
      case "file":
        return <Kind.File {...this.props}/>;
        break;
    }
  }

}
