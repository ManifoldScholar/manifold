# frozen_string_literal: true

RSpec.describe "UserGroup API", type: :request do
  let(:request_method) { raise "must set request method" }

  def expect_making_the_request(method: request_method, path: request_path, headers: admin_headers, **options)
    expect do
      __send__ method, path, headers: headers, **options
    end
  end

  describe "/api/v1/user_groups" do
    let(:request_path) { api_v1_user_groups_path }

    describe "GET" do
      let(:request_method) { :get }
      let!(:user_group) { FactoryBot.create(:user_group) }

      it "responds with the list of user groups" do
        expect_making_the_request.not_to raise_error

        expect(response).to be_successful
      end
    end

    describe "POST" do
      let(:request_method) { :post }

      let(:name) { Faker::Company.name }

      let(:user) { FactoryBot.create(:user) }
      let(:entitleable) { raise "must create entitleable" }

      let(:request_params) do
        build_json_payload(
          attributes: {
            name:
          }, relationships: {
            members: [{ id: user.id }],
            entitleables: [{ id: entitleable.id }]
          }
        )
      end

      context "for a project" do
        let!(:entitleable) { FactoryBot.create :project }

        it "creates an user group" do
          expect_making_the_request(params: request_params).to change(UserGroup, :count).by(1)

          expect(response).to have_http_status :created
        end

        context "that is invalid" do
          let(:name) { nil }

          it "fails to create the user group" do
            expect_making_the_request(params: request_params).to keep_the_same(UserGroup, :count)
          end
        end
      end

    end
  end

  describe "/api/v1/user_groups/:id" do
    let!(:user_group) { FactoryBot.create :user_group }

    let(:request_path) { api_v1_user_group_path(user_group.id) }

    describe "GET" do
      let(:request_method) { :get }

      it "responds with a single export target" do
        expect_making_the_request.not_to raise_error

        expect(response).to be_successful
      end
    end

    describe "PUT" do
      let(:request_method) { :put }
      let(:new_name) { Faker::Company.name }

      let(:request_params) do
        build_json_payload(
          attributes: {
            name: new_name
          }
        )
      end

      it "updates an existing user group" do
        expect_making_the_request(params: request_params).to change { user_group.reload.name }.to(new_name)

        expect(response).to have_http_status :ok
      end

    end

    describe "DELETE" do
      let(:request_method) { :delete }

      it "destroys the export target" do
        expect_making_the_request.to change(UserGroup, :count).by(-1)

        expect(response).to have_http_status :no_content
      end
    end
  end
end
