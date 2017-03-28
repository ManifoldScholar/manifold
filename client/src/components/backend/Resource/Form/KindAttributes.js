import React, { PureComponent, PropTypes } from 'react';
import { Resource, Form } from 'components/backend';
import get from 'lodash/get';

export default class KindAttributes extends PureComponent {

  static displayName = "Resource.KindAttributes";

  static propTypes = {
    dirtyModel: PropTypes.object,
    kind: PropTypes.string
  };

  selectedKind(props) {
    const path = 'attributes.kind';
    return get(props.dirtyModel, path) || get(props.sourceModel.path)
  }

  render() {
    switch (this.selectedKind(this.props)) {
      case "image":
        return <Resource.Form.Kind.Image {...this.props}/>;
      case "video":
        return <Resource.Form.Kind.Video {...this.props}/>;
      case "audio":
        return <Resource.Form.Kind.Audio {...this.props}/>;
      case "interactive":
        return <Resource.Form.Kind.Interactive {...this.props}/>;
      case "link":
        return <Resource.Form.Kind.Link {...this.props}/>;
      case "spreadsheet":
        return <Resource.Form.Kind.Spreadsheet {...this.props}/>;
      case "document":
        return <Resource.Form.Kind.Document {...this.props}/>;
      case "presentation":
        return <Resource.Form.Kind.Presentation {...this.props}/>;
      case "pdf":
        return <Resource.Form.Kind.Pdf {...this.props}/>;
      case "file":
        return <Resource.Form.Kind.File {...this.props}/>;
      default:
        return null;
    }
  }

}
