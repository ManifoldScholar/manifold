# frozen_string_literal: true

RSpec.describe "Contacts API", type: :request do
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

  describe "sends the message to installation" do
    context "when params are valid" do
      describe "the response" do
        it "has a 204 status code" do
          post api_v1_contacts_path, headers: headers, params: build_json_payload(valid_params)
          expect(response).to have_http_status(204)
        end
      end
    end

    context "when params are invalid" do
      before(:each) do
        post api_v1_contacts_path, headers: headers, params: build_json_payload(invalid_params)
      end
      describe "the response" do
        it "has a 422 status code" do
          expect(response).to have_http_status(422)
        end

        it "has the field errors" do
          errors = JSON.parse(response.body)["errors"]
          expect(errors).to eq [{ "detail" => "is required", "source" => { "pointer" => "/data/attributes/message" } }]
        end
      end
    end
  end
end
