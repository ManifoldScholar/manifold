shared_examples_for "an API destroy request" do |options|
  include_context("authenticated request")
  include_context("param helpers")

  api_spec_helper = ApiDocs::Helpers::Request.new(options, :destroy)

  delete api_spec_helper.summary do
    api_spec_helper.parameters.each do |parameter_options|
      parameter(parameter_options)
    end
    description api_spec_helper.response_description if api_spec_helper.response_description?
    security [apiKey: []]
    tags api_spec_helper.tags

    response api_spec_helper.success_response_code, api_spec_helper.success_description, focus: api_spec_helper.focus do
      let(:Authorization) { get_user_token(api_spec_helper.authorized_user) } if api_spec_helper.requires_auth?
      run_test!
    end

    unless api_spec_helper.exclude_401
      response "401", I18n.t("swagger.not_authenticated"), focus: api_spec_helper.focus do
        let(:Authorization) {}
        run_test!
      end
    end
  end
end
