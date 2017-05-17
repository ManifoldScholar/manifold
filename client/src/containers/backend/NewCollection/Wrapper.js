import React, { PureComponent, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Form as FormContainer } from 'containers/backend';
import { Navigation, Form } from 'components/backend';
import { collectionsAPI, notifications } from 'api';
import { notificationActions } from 'actions';
import lh from 'helpers/linkHandler';

export class NewCollectionWrapperContainer extends PureComponent {

  static displayName = "NewCollection.WrapperContainer";
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  redirectToCollection(collection) {
    const path = lh.link("backendCollection", collection.id);
    this.props.history.push(path);
  }

  handleSuccess(collection) {
    this.redirectToCollection(collection);
  }

  render() {
    const { match } = this.props;

    return (
      <div>
        <Navigation.DetailHeader
          type="collection"
          breadcrumb={[
            {
              path: lh.link("backendProjectCollections", match.params.projectId),
              label: "Collections"
            }
          ]}
          title={'New Collection'}
          showUtility={false}
          note={'Enter a name and a brief description.' +
          ' Press save to continue.'}
        />
        <section className="backend-panel">
          <div className="container">
            <div className="panel">
              <FormContainer.Form
                model={this.props.collection}
                name="backend-collection-create"
                update={collectionsAPI.update}
                create={(model) => collectionsAPI.create(match.params.projectId, model) }
                onSuccess={this.handleSuccess}
                className="form-secondary"
              >
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
                <Form.Upload
                  style="landscape"
                  accepts="images"
                  label="Cover Image"
                  readFrom="attributes[thumbnailStyles][mediumLandscape]"
                  name="attributes[thumbnail]"
                  remove="attributes[removeThumbnail]"
                />
                <Form.Save
                  text="Save and continue"
                  cancelRoute={lh.link("backendProjectResources", match.params.projectId)}
                />
              </FormContainer.Form>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(NewCollectionWrapperContainer);

