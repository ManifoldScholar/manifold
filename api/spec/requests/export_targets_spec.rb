# frozen_string_literal: true

RSpec.describe "ExportTargets API", type: :request do
  let(:request_method) { raise "must set request method" }

  def expect_making_the_request(method: request_method, path: request_path, headers: admin_headers, **options)
    expect do
      __send__ method, path, headers: headers, **options
    end
  end

  describe "/api/v1/export_targets" do
    let(:request_path) { api_v1_export_targets_path }

    describe "GET" do
      let(:request_method) { :get }
      let!(:key_target) { FactoryBot.create :export_target, :sftp_key }
      let!(:password_target) { FactoryBot.create :export_target, :sftp_password }

      it "responds with the list of export targets" do
        expect_making_the_request.not_to raise_error

        expect(response).to be_successful
      end
    end

    describe "POST" do
      let(:request_method) { :post }

      let(:valid_configuration_params) do
        FactoryBot.build(
          :export_strategies_configuration, :using_sftp_password_strategy
        ).as_json.without(:strategy)
      end

      let(:valid_params) do
        build_json_payload(
          attributes: FactoryBot.attributes_for(:export_target, :sftp_password).merge(
            configuration: valid_configuration_params
          )
        )
      end

      it "creates an export target with valid params" do
        expect_making_the_request(params: valid_params).to change(ExportTarget, :count).by(1)

        expect(response).to have_http_status :created
      end
    end
  end

  describe "/api/v1/export_targets/:id" do
    let!(:export_target) { FactoryBot.create :export_target, :sftp_password }

    let(:request_path) { api_v1_export_target_path(export_target.slug) }

    describe "GET" do
      let(:request_method) { :get }

      it "responds with a single export target" do
        expect_making_the_request.not_to raise_error

        expect(response).to be_successful
      end
    end

    describe "PUT" do
      let(:request_method) { :put }

      let!(:old_name) { export_target.name }
      let!(:new_name) { "A New Name" }

      let(:valid_params) do
        build_json_payload(attributes: { name: new_name })
      end

      it "updates successfully given valid params" do
        expect_making_the_request(params: valid_params).to change { export_target.reload.name }.from(old_name).to(new_name)
      end
    end

    describe "DELETE" do
      let(:request_method) { :delete }

      it "destroys the export target" do
        expect_making_the_request.to change(ExportTarget, :count).by(-1)

        expect(response).to have_http_status :no_content
      end
    end
  end
end
