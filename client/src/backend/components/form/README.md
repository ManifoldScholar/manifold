Example Form:

```
        <FormContainer.Form
          model={this.props.project}
          name="backend-project-general"
          update={projectsAPI.update}
          create={projectsAPI.create}
          className="form-secondary"
        >
          <Form.TextInput
            label="Title"
            name="attributes[title]"
            placeholder="Enter Project Title"
          />
          <Form.TextInput
            label="Subtitle"
            name="attributes[subtitle]"
            placeholder="Enter Project Subtitle"
          />
          <Form.Switch
            label="Featured"
            name="attributes[featured]"
          />
          <Form.Radios
            label="Featured"
            name="attributes[featured]"
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false }
            ]}
          />
          <Form.MaskedTextInput
            label="Hashtag"
            name="attributes[hashtag]"
            mask="hashtag"
          />
          <Form.TextArea
            label="Description"
            name="attributes[description]"
          />
          <Form.TextInput
            label="Purchase URL"
            name="attributes[purchaseUrl]"
            placeholder="Enter Purchase URL"
          />
          <Form.MaskedTextInput
            label="Purchase Price"
            name="attributes[purchasePriceMoney]"
            mask="currency"
          />
          <Form.TextInput
            label="Currency"
            name="attributes[purchasePriceCurrency]"
            placeholder="Enter Purchase Price Currency Code"
          />
          <Form.TextInput
            label="Twitter Username"
            name="attributes[twitterId]"
            placeholder="Enter Twitter username"
          />
          <Form.TextInput
            label="Instagram Username"
            name="attributes[instagramId]"
            placeholder="Enter Instagram username"
          />
          <Form.Save
            text="Save Project"
          />
        </FormContainer.Form>
```
