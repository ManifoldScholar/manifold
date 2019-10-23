shared_examples_for "an API destroy request" do |options|
  include_context("authenticated request")
  include_context("param helpers")

  api_spec_helper = ApiDocs::Helpers::Request.new(options, :destroy)

  delete api_spec_helper.summary do
    api_spec_helper.parameters.each do |parameter_options|
      parameter(parameter_options)
    end
    description api_spec_helper.description if api_spec_helper.description
    security [apiKey: []]
    tags api_spec_helper.tags

    response "204", api_spec_helper.success_description, focus: api_spec_helper.focus do
      let(:Authorization) { get_user_token(api_spec_helper.auth_type) }
      run_test!
    end

    unless api_spec_helper.exclude_403
      response "403", I18n.t("swagger.access_denied"), focus: api_spec_helper.focus do
        let(:Authorization) {}
        run_test!
      end
    end
  end
end
