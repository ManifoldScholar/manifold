import React, { PureComponent, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Dialog } from 'components/backend';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { ingestionsAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { select, isLoaded } from 'utils/entityUtils';
import has from 'lodash/has';
import get from 'lodash/get';
import lh from 'helpers/linkHandler';
const { request, flush } = entityStoreActions;

class ProjectDetailTextNew extends PureComponent {

  static displayName = "ProjectDetail.Text.Upload";

  static mapStateToProps(state) {
    return {
      session: get(state.entityEditor.sessions, requests.beIngestionCreate),
      ingestion: select(requests.beIngestionCreate, state.entityStore),
    };
  }

  static fetchData(getState, dispatch, location, match) {
    if (!match.params.ingestionId) return;
    if (isLoaded(requests.beIngestionCreate, getState())) return;
    const call = ingestionsAPI.show(match.params.ingestionId);
    const ingestion = request(call, requests.beIngestionCreate);
    const { promise: one } = dispatch(ingestion);
    return Promise.all([one]);
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    project: PropTypes.object,
    refresh: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      step: 1
    };

    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.createIngestion = this.createIngestion.bind(this);
    this.updateIngestion = this.updateIngestion.bind(this);
    this.redirectToIngest = this.redirectToIngest.bind(this);
    this.close = this.close.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beIngestionCreate));
    this.props.refresh();
  }

  selectedIngestionType(props) {
    if (!props.session) return null;
    const path = "attributes.ingestionType";
    if (has(props.session.dirty, path)) return get(props.session.dirty, path);
    if (has(props.session.source, path)) return get(props.session.source, path);
    return null;
  }

  ingestionTypeOptions() {
    return [
      {
        value: "epub",
        label: "EPUB v2 or v3"
      },
      {
        value: "word",
        label: "Word HTML Export"
      },
      {
        value: "markdown",
        label: "Markdown document(s)"
      },
      {
        value: "googledoc",
        label: "Google Doc"
      }
    ];
  }

  nextStep(event) {
    event.preventDefault();
    const step = this.state.step + 1;
    this.setStep(step);
  }

  previousStep(event) {
    event.preventDefault();
    const step = this.state.step - 1;
    this.setStep(step);
  }

  close(event = null) {
    if (event) event.preventDefault();
    this.props.history.push(this.closeUrl());
  }

  setStep(step) {
    let validStep = step;
    if (step < 1) validStep = 1;
    if (step > 2) validStep = 2;
    this.setState({ step: validStep });
  }

  redirectToIngest() {
    this.props.history.push(this.ingestUrl());
  }

  ingestUrl() {
    return lh.backendProjectIngestionProcess(
      this.props.project.id,
      this.props.ingestion.id
    );
  }

  closeUrl() {
    return lh.link("backendProjectTexts", this.props.project.id);
  }

  currentAttributes() {
    if (!this.props.session) return null;
    const { source, dirty } = this.props.session;
    return Object.assign({}, source.attributes, dirty.attributes);
  }

  componentWillMount() {
    if (this.props.match.params.step) {
      this.setState({ step: parseInt(this.props.match.params.step, 10) });
    }
  }

  canContinue() {
    const attributes = this.currentAttributes();
    if (!attributes) return;
    const { step } = this.state;
    if (step === 1 && attributes.ingestionType) return true;
    if (step === 2 && attributes.source || attributes.ExternalSourceUrl) return true;
    return false;
  }

  canSave() {
    const attributes = this.currentAttributes();
    if (!attributes) return false;
    if (attributes.ingestionType && (attributes.source || attributes.ExternalSourceUrl)) {
      return true;
    }
    return false;
  }

  updateIngestion(id, attributes) {
    return ingestionsAPI.update(this.props.ingestion.id, attributes);
  }

  createIngestion(attributes) {
    return ingestionsAPI.create(this.props.project.id, attributes);
  }

  renderStepOne() {
    if (!this.props.session) return;
    const ingestionType = this.selectedIngestionType(this.props);

    return (
      <Form.FieldGroup>
        <Form.Radios
          layout="vertical"
          name="attributes[ingestionType]"
          label="Text Format"
          options={this.ingestionTypeOptions()}
        />
        <div style={{ marginTop: 30 }} className="buttons-icon-horizontal">
          <button
            onClick={this.close}
            className="button-icon-secondary"
          >
            <i className="manicon manicon-x small"></i>
            Cancel
          </button>
          <button
            onClick={this.nextStep}
            className="button-icon-secondary"
            disabled={!this.canContinue()}
          >
            <i className="manicon manicon-check small"></i>
            Continue
          </button>
        </div>
      </Form.FieldGroup>
    );
  }

  renderStep() {
    const { step } = this.state;
    if (step === 1) return this.renderStepOne();
    if (step === 2) return this.renderStepTwo();
    return null;
  }

  renderStepTwo() {

    if (!this.props.session) return;
    const ingestionType = this.selectedIngestionType(this.props);

    /* eslint-disable max-len */
    return (
      <Form.FieldGroup>
        { ingestionType === "googledoc" ?
          <Form.TextInput
            label="URL"
            name="attributes[externalSourceUrl]"
            instructions="Manifold can ingest any publically avaiable Google doc by entering its URL."
          />
          : null}
        { ingestionType === "epub" ?
          <Form.Upload
            inlineStyle={{ width: "100%" }}
            style="landscape"
            name="attributes[source]"
            readFrom="attributes[sourceFileName]"
            instructions="Manifold supports both v2 and v3 epub files."
            label="Upload a file ending in .epub"
            accepts="epubs"
          />
          : null}
        { ingestionType === "word" ?
          <Form.Upload
            inlineStyle={{ width: "100%" }}
            style="landscape"
            name="attributes[source]"
            readFrom="attributes[sourceFileName]"
            instructions="To create a text from a word document, save the word document as HTML and create a single zip archive. Manifold will expect to see a top level directory in the archive ending in .fld"
            label="Zip source file"
            accepts="zips"
          />
          : null}
        { ingestionType === "markdown" ?
          <Form.Upload
            inlineStyle={{ width: "100%" }}
            style="landscape"
            name="attributes[source]"
            readFrom="attributes[sourceFileName]"
            instructions="Upload a single markdown file, or a zipped collection of markdown files with a book.json file in root directory"
            label="Markdown or .zip source file"
            accepts="zips"
          />
          : null}
        <div style={{ marginTop: 30 }} className="buttons-icon-horizontal">
          <button
            onClick={this.previousStep}
            className="button-icon-secondary"
          >
            <i className="manicon manicon-x small"></i>
            Back
          </button>
          <input
            className="button-icon-secondary"
            type="submit"
            value="Continue"
          />
        </div>
      </Form.FieldGroup>
    );
  }
  /* eslint-enable max-len */

  render() {
    const { dirtyModel } = this.props;
    return (
      <FormContainer.Form
        groupErrors
        groupErrorsStyle={{ marginBottom: 20 }}
        model={this.props.ingestion}
        name={requests.beIngestionCreate}
        update={this.updateIngestion}
        create={this.createIngestion}
        onSuccess={this.redirectToIngest}
        className="form-secondary"
      >
        {this.renderStep()}
      </FormContainer.Form>
    );
  }

}

export default connectAndFetch(ProjectDetailTextNew);
