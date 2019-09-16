require "swagger_helper"

RSpec.describe "Contacts API", type: :request do
  include_context("authenticated request")
  include_context("param helpers")

  let(:headers) { anonymous_headers }
  let(:valid_params) do
    { attributes: {
      full_name: "Rowan Dog",
      email: "woof@bark.dog",
      message: "I am dog."
    } }
  end
  let(:invalid_params) do
    { attributes: {
      full_name: "Rowan Dog",
      email: "woof@bark.dog"
    } }
  end

  path '/contacts' do
    post I18n.t('swagger.post.description', type: 'contact', attribute: 'ID') do
      consumes 'application/json'
      parameter name: :contact_params, :in => :body, schema: { '$ref' => '#/definitions/ContactRequestCreate' }
      tags 'Contacts'

      response '204', I18n.t('swagger.post.description', type: 'contact', attributes: 'ID') do
        let(:contact_params) {{ data: valid_params }}
        run_test!
      end

      response '422', I18n.t('swagger.unprocessable') do
        let(:contact_params) {{ data: invalid_params }}
        schema '$ref' => '#/definitions/ContactResponseError'
        run_test!
      end
    end
  end

  describe "creates a new contact email" do
    context "when params are invalid" do
      before(:each) do
        post api_v1_contacts_path, headers: headers, params: json_payload(invalid_params)
      end
      describe "the response" do
        it "has the field errors" do
          errors = JSON.parse(response.body)["errors"]
          expect(errors).to eq [{ "detail" => "is required", "source" => { "pointer" => "/data/attributes/message" } }]
        end
      end
    end
  end
end
