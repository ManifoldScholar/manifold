# frozen_string_literal: true

RSpec.describe "Entitlements API", type: :request do
  let(:request_method) { raise "must set request method" }

  let!(:target_user) { FactoryBot.create :user }

  let(:read_access) { false }
  let(:subscriber) { false }
  let(:global_roles) { { subscriber: subscriber } }
  let(:scoped_roles) { { read_access: read_access } }

  def expect_making_the_request(method: request_method, path: request_path, headers: admin_headers, **options)
    expect do
      __send__ method, path, headers: headers, **options
    end
  end

  describe "/api/v1/entitlements" do
    let(:request_path) { api_v1_entitlements_path }

    describe "GET" do
      let(:request_method) { :get }
      let!(:project) { FactoryBot.create :project, { draft: false } }
      let!(:subscriber_entitlement) { FactoryBot.create :entitlement, :global_subscriber }
      let!(:subscriber_project_read) { FactoryBot.create :entitlement, :read_access, subject: project }

      it "responds with the list of entitlements" do
        expect_making_the_request.not_to raise_error

        expect(response).to be_successful
      end
    end

    describe "POST" do
      let(:request_method) { :post }

      let(:subject_url) { "gid://entitlements/nothing/anything" }
      let(:target_url) { target_user.to_gid.to_s }

      let(:request_params) do
        build_json_payload(
          attributes: {
            subject_url: subject_url,
            target_url: target_url,
            global_roles: global_roles,
            scoped_roles: scoped_roles
          }
        )
      end

      context "for a project" do
        let(:read_access) { true }
        let!(:entitled) { FactoryBot.create :project }
        let(:subject_url) { entitled.to_entitlement_gid.to_s }

        it "creates an entitlement" do
          expect_making_the_request(params: request_params).to change(Entitlement, :count).by(1)

          expect(response).to have_http_status :created
        end

        context "that is invalid" do
          let(:read_access) { false }

          it "fails to create the entitlement" do
            expect_making_the_request(params: request_params).to keep_the_same(Entitlement, :count)
          end
        end
      end

      context "for a subscriber" do
        let(:subject_url) { "gid://entitlements/SystemEntitlement/subscription" }

        let(:subscriber) { true }

        it "creates an entitlement" do
          expect_making_the_request(params: request_params).to change(Entitlement, :count).by(1)

          expect(response).to have_http_status :created
        end
      end
    end
  end

  describe "/api/v1/entitlements/:id" do
    let!(:entitlement) { FactoryBot.create :entitlement, :global_subscriber }

    let(:request_path) { api_v1_entitlement_path(entitlement.id) }

    describe "GET" do
      let(:request_method) { :get }

      it "responds with a single export target" do
        expect_making_the_request.not_to raise_error

        expect(response).to be_successful
      end
    end

    describe "DELETE" do
      let(:request_method) { :delete }

      it "destroys the export target" do
        expect_making_the_request.to change(Entitlement, :count).by(-1)

        expect(response).to have_http_status :no_content
      end
    end
  end
end
