import React, { PureComponent, PropTypes } from 'react';
import { Resource, Form } from 'components/backend';

export default class KindAttributes extends PureComponent {

  static displayName = "Resource.KindAttributes";

  static propTypes = {
    dirtyModel: PropTypes.object,
    kind: PropTypes.string
  };

  render() {
    if (!this.props.kind && !this.props.sourceModel.attributes.kind) return null;
    const kind = this.props.kind ? this.props.kind : this.props.sourceModel.attributes.kind;
    switch (kind) {
      case "image":
        return <Resource.Form.Kind.Image {...this.props}/>;
        break;
      case "video":
        return <Resource.Form.Kind.Video {...this.props}/>;
        break;
      case "audio":
        return <Resource.Form.Kind.Audio {...this.props}/>;
        break;
      case "interactive":
        return <Resource.Form.Kind.Interactive {...this.props}/>;
        break;
      case "link":
        return <Resource.Form.Kind.Link {...this.props}/>;
        break;
      case "spreadsheet":
        return <Resource.Form.Kind.Spreadsheet {...this.props}/>;
        break;
      case "document":
        return <Resource.Form.Kind.Document {...this.props}/>;
        break;
      case "presentation":
        return <Resource.Form.Kind.Presentation {...this.props}/>;
        break;
      case "pdf":
        return <Resource.Form.Kind.Pdf {...this.props}/>;
        break;
      case "file":
        return <Resource.Form.Kind.File {...this.props}/>;
        break;
    }
  }

}
