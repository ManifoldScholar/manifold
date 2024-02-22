# frozen_string_literal: true

RSpec.shared_examples_for "orderable api requests" do
  let(:path) { raise "Must be overridden" }
  let!(:object_a) { raise "Must be overridden" }
  let!(:object_b) { raise "Must be overridden" }
  let(:api_response) { JSON.parse(response.body) }

  context "when the position attribute is set to" do
    it "\"up\", it returns the new position" do
      valid_params = build_json_payload(attributes: { position: "up"})
      put __send__(path, object_b.id), headers: admin_headers, params: valid_params
      expect(api_response["data"]["attributes"]["position"]).to eq 1
    end

    it "\"down\", it returns the new position" do
      valid_params = build_json_payload(attributes: { position: "down"})
      put __send__(path, object_a.id), headers: admin_headers, params: valid_params
      expect(api_response["data"]["attributes"]["position"]).to eq 2
    end
  end
end
