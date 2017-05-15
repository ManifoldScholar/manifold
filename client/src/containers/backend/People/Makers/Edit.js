import React, { PureComponent, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Dialog } from 'components/backend';
import { entityStoreActions } from 'actions';
import { select } from 'utils/entityUtils';
import { makersAPI, requests } from 'api';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import get from 'lodash/get';
import lh from 'helpers/linkHandler';

const { request, flush } = entityStoreActions;

export class MakersEditContainer extends PureComponent {

  static displayName = "Makers.Edit";

  static mapStateToProps(state, ownProps) {
    return {
      maker: select(requests.beMaker, state.entityStore),
      updateMakers: get(state.entityStore.responses, requests.beMakerUpdate)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
    this.updateUsers = this.updateUsers.bind(this);
  }

  componentDidMount() {
    this.fetchMaker(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.beMakerUpdate]));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchMaker(nextProps.match.params.id);
    }
  }

  fetchMaker(id) {
    const call = makersAPI.show(id);
    const makerRequest = request(call, requests.beMaker);
    this.props.dispatch(makerRequest);
  }

  handleMakerDestroy(event, maker) {
    const heading = "Are you sure you want to delete this maker?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(() => {
      this.destroyMaker(maker);
      this.closeDialog();
    }, () => { this.closeDialog(); });
  }

  destroyMaker(maker) {
    const call = makersAPI.destroy(maker.id);
    const options = { removes: maker };
    const makerRequest = request(call, requests.beMakerDestroy, options);
    this.props.dispatch(makerRequest).promise.then(() => {
      this.props.history.push(lh.link("backendPeopleMakers"));
    });
  }

  updateUsers(users, changeType) {
    const adjustedUsers = users.map((e) => {
      return {
        id: e.id,
        type: e.type
      };
    });
    const maker = {
      type: this.props.maker.type,
      id: this.props.maker.id,
      relationships: { users: { data: adjustedUsers } }
    };
    const call = makersAPI.update(maker.id, maker);
    const userRequest = request(call, requests.beMakerUpdate);
    this.props.dispatch(userRequest);
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  render() {
    if (!this.props.maker) return null;
    const attr = this.props.maker.attributes;
    const maker = this.props.maker;

    /*
     Edit dialog(s) can be wrapped in either
     <Drawer.Wrapper>: Right-hand pop-in panel
     <Dialog.Wrapper> Overlay with dialog box
     */
    return (
      <div>
        {
          this.state.confirmation ?
            <Dialog.Confirm {...this.state.confirmation} />
            : null
        }
        <header className="drawer-header">
          <h2 className="heading-quaternary">
            {`${attr.firstName} ${attr.lastName}`}
          </h2>
          <div className="buttons-bare-vertical">
            <button
              className="button-bare-primary"
              onClick={(event) => { this.handleMakerDestroy(event, this.props.maker); }}
            >
              {'Delete Maker'}
              <i className="manicon manicon-trashcan"></i>
            </button>
          </div>
        </header>
        <section className="form-section">
          <FormContainer.Form
            model={this.props.maker}
            name="backend-maker-update"
            update={makersAPI.update}
            create={makersAPI.create}
            className="form-secondary"
          >
            <Form.TextInput
              label="First Name"
              name="attributes[firstName]"
              placeholder="First Name"
            />
            <Form.TextInput
              label="Last Name"
              name="attributes[lastName]"
              placeholder="Last Name"
            />
            <Form.Upload
              style="square"
              accepts="images"
              label="Avatar Image"
              readFrom="attributes[avatarStyles][smallSquare]"
              name="attributes[avatar]"
              remove="attributes[removeAvatar]"
            />
            <Form.Save
              text="Save Maker"
            />
          </FormContainer.Form>
        </section>
        <section className="form-section">
          <form className="form-secondary">
            <FormContainer.UserClaims
              label="Users"
              placeholder="Add an associated user"
              api={makersAPI}
              entity={maker}
              onChange={this.updateUsers}
            />
          </form>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(MakersEditContainer);

