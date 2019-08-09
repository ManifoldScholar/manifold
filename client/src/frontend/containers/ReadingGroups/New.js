import React, { PureComponent } from "react";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import connectAndFetch from "utils/connectAndFetch";
import { meAPI, requests } from "api";
console.log(Form, "form");
class ReadingGroupsNewContainer extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <FormContainer.Form
          name={requests.feNewReadingGroup}
          update={() => {}}
          create={() => {}}
          options={{ adds: requests.feMyReadingGroups }}
          onSuccess={() => {}}
          className="form-secondary permissions-form"
          notificationScope="drawer"
        >
          <Form.TextInput
            wide
            label="Slug"
            name="attributes[pendingSlug]"
            placeholder="Enter Project Slug"
          />
        </FormContainer.Form>
      </React.Fragment>
    );
  }
}

export default connectAndFetch(ReadingGroupsNewContainer);
