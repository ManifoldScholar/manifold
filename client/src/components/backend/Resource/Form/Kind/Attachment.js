import React, { PureComponent, PropTypes } from 'react';
import AttachmentType from './AttachmentType';
import { Form } from 'components/backend';

export default class ResourceFormKindAttachment extends PureComponent {

  static displayName = "Resource.Form.Kind.Attachment";

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  initialState() {
    return {
      section: null
    };
  }

  updateRenderSection(attachment) {
    if (!attachment) return null;
    console.log(attachment.content_type);
    const ext = attachment.content_type;
    if (ext.includes('image')) {
      this.setState({section: 'image'});
    }
    if (ext.includes('video')) {
      this.setState({section: 'video'});
    }
    if (ext.includes('application')) {
      this.setState({section: 'file'});
    }
    if (ext.includes('audio')) {
      this.setState({section: 'audio'});
    }
  }

  renderAttachmentSection() {
    if (!this.state.section && !this.props.sourceModel.attributes.kind) return null;
    const ext = this.state.section ? this.state.section : this.props.sourceModel.attributes.kind;
    switch (ext) {
      case "image":
        return <AttachmentType.Image {...this.props}/>;
        break;
      case "video":
        return <AttachmentType.Video {...this.props}/>;
        break;
      case "file":
        return <AttachmentType.File {...this.props}/>;
        break;
      case "audio":
        return <AttachmentType.Audio {...this.props}/>;
        break;
    }
  }

  render() {
    return (
      <div className="form-section">
        <Form.Upload
          style="square"
          label="File Upload"
          accepts="all"
          current={this.props.sourceModel.attributes.attachmentName}
          name="attributes[attachment]"
          remove="attributes[removeAttachment]"
          onChange={(attachment) => this.updateRenderSection(attachment)}
        />
        {this.renderAttachmentSection()}
      </div>
    )
  }

}
