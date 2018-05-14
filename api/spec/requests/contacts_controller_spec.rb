require "rails_helper"

RSpec.describe "Contacts API", type: :request do
  include_context("authenticated request")
  include_context("param helpers")

  let(:headers) { anonymous_headers }
  let(:valid_params) do
    { attributes: {
      full_name: "Rowan Dog",
      email: "woof@bark.dog",
      message: "I am dog." }
    }
  end
  let(:invalid_params) do
    { attributes: {
      full_name: "Rowan Dog",
      email: "woof@bark.dog" }
    }
  end

  describe "sends the message to installation" do
    context "when params are valid" do
      describe "the response" do
        it "has a 204 status code" do
          post api_v1_contacts_path, headers: headers, params: json_payload(valid_params)
          expect(response).to have_http_status(204)
        end

        # it "enqueues the mailer" do
        #   expect {
        #     post api_v1_contacts_path, headers: headers, params: json_payload(valid_params)
        #   }.to have_enqueued_job.on_queue "mailers"
        # end
      end
    end

    context "when params are invalid" do
      before(:each) do
        post api_v1_contacts_path, headers: headers, params: json_payload(invalid_params)
      end
      describe "the response" do
        it "has a 422 status code" do
          expect(response).to have_http_status(422)
        end

        it "has the field errors" do
          errors = JSON.parse(response.body)["errors"]
          expect(errors).to eq [{"source"=>{"pointer"=>"/data/attributes/message"}, "detail"=>"is required"}]
        end
      end
    end
  end
end
