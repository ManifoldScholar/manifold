# frozen_string_literal: true

RSpec.shared_context "an API destroy request" do |options|
  api_spec_helper = APIDocs::Helpers::Request.new(options, :destroy)

  let(:resource_instance) do
    defined?(resource) ? resource : FactoryBot.create(api_spec_helper.factory)
  end
  let(:id) { resource_instance.id }

  delete api_spec_helper.summary do
    api_spec_helper.parameters.each do |parameter_options|
      parameter(**parameter_options)
    end
    description api_spec_helper.response_description if api_spec_helper.response_description?
    produces api_spec_helper.content_type if api_spec_helper.delete_has_response_body?
    security [apiKey: []]
    tags api_spec_helper.tags

    response api_spec_helper.success_response_code, api_spec_helper.success_description, focus: api_spec_helper.focus do
      let(:Authorization) { get_user_token(api_spec_helper.authorized_user) } if api_spec_helper.requires_auth?
      schema api_spec_helper.response if api_spec_helper.delete_has_response_body?
      run_test!
    end

    unless api_spec_helper.exclude_401
      response "401", I18n.t("swagger.not_authenticated"), focus: api_spec_helper.focus do
        let(:Authorization) { "" }
        run_test!
      end
    end
  end
end
