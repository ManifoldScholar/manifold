import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

class ResourceFormKindAudio extends PureComponent {
  static displayName = "Resource.Form.Kind.Audio";

  static propTypes = {
    t: PropTypes.func
  };

  render() {
    return (
      <Styled.Group>
        <Form.Upload
          layout="square"
          label={this.props.t("resources.new.audio_file")}
          accepts="audio"
          readFrom="attributes[attachmentFileName]"
          name="attributes[attachment]"
          remove="attributes[removeAttachment]"
          {...this.props}
        />
        <Form.Upload
          layout="landscape"
          label={this.props.t("resources.new.transcript")}
          readFrom="attributes[transcriptFileName]"
          name="attributes[transcript]"
          remove="attributes[removeTranscript]"
          {...this.props}
        />
      </Styled.Group>
    );
  }
}

export default withTranslation()(ResourceFormKindAudio);
