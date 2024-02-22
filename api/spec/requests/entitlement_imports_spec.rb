# frozen_string_literal: true

RSpec.describe "Entitlement Imports API", type: :request do
  context "when fetching imports" do
    let(:path) { api_v1_entitlement_imports_path }

    let!(:imports) do
      FactoryBot.create_list :entitlement_import, 2
    end

    let!(:rows) do
      imports.map do |import|
        1.upto(5).each do |line_number|
          FactoryBot.create(
            :entitlement_import_row,
            entitlement_import: import,
            line_number: line_number,
            email: Faker::Internet.unique.email,
            subject: SystemEntitlement.fetch(:subscription)
          )
        end
      end
    end

    it "renders okay" do
      expect do
        get path, headers: admin_headers
      end.to execute_safely

      expect(response).to have_http_status(200)
    end
  end

  context "when creating an import" do
    let(:path) { api_v1_entitlement_imports_path }

    let!(:csv_file) do
      ManifoldApi::Container["entitlement_imports.generate_fake"].().value!
    end

    let!(:file_params) do
      contents = csv_file.read

      encoded = Base64.urlsafe_encode64(contents)

      {
        content_type: "text/csv",
        data: "data:text/csv;base64,#{encoded}",
        filename: "import.csv",
      }
    end

    context "with valid inputs" do
      let(:attributes) do
        {
          name: "An entitlement import",
          file: file_params,
        }
      end

      let(:valid_params) do
        build_json_payload(attributes: attributes)
      end

      it "creates the record correctly" do
        expect do
          post path, headers: admin_headers, params: valid_params

          resp = JSON.parse response.body

          @entitlement = EntitlementImport.find resp.dig("data", "id") rescue nil
        end.to change(EntitlementImport, :count).by(1).and have_enqueued_job(Entitlements::ProcessImportJob).once

        expect(@entitlement).to be_in_state(:pending)
      end
    end
  end
end
