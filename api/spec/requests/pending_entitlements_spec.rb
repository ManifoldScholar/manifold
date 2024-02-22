# frozen_string_literal: true

RSpec.describe "Pending Entitlements API", type: :request do
  context "when fetching entitlements" do
    let(:filter) do
      {}
    end

    let(:params) do
      {
        filter: filter,
      }
    end

    let(:path) { api_v1_pending_entitlements_path }

    let!(:pending_entitlements) do
      FactoryBot.create_list :pending_entitlement, 2
    end

    it "renders okay" do
      expect do
        get path, headers: admin_headers
      end.to execute_safely

      expect(response).to have_http_status(200)
    end

    context "when filtering by currentState: success" do
      let(:filter) do
        {
          state: "success"
        }
      end

      let!(:successful_entitlement) do
        FactoryBot.create(:pending_entitlement, :successful)
      end

      it "renders the expected result" do
        expect do
          get path, headers: admin_headers, params: params
        end.to execute_safely

        resp = response.parsed_body.try(:with_indifferent_access)

        aggregate_failures do
          expect(resp[:data]).to have(1).item
          expect(resp.dig(:data, 0, :id)).to eq successful_entitlement.id
          expect(resp.dig(:data, 0, :attributes, :currentState)).to eq "success"
        end
      end
    end
  end

  context "when fetching a single entitlement" do
    let!(:pending_entitlement) { FactoryBot.create :pending_entitlement }

    let(:path) { api_v1_pending_entitlement_path pending_entitlement }

    it "removes the pending entitlement" do
      expect do
        get path, headers: admin_headers
      end.to execute_safely

      expect(response).to have_http_status(200)
    end
  end

  context "when creating an entitlement" do
    let!(:project) { FactoryBot.create :project }

    let(:path) { api_v1_pending_entitlements_path }

    let(:expiration) { nil }
    let(:subject_url) { project.to_entitlement_gid.to_s }
    let(:email) { Faker::Internet.unique.email }

    let(:attributes) do
      {
        subject_url: subject_url,
        expiration: expiration,
        email: email,
      }
    end

    let(:params) do
      build_json_payload(attributes: attributes)
    end

    def find_created!
      resp = JSON.parse response.body

      @created = PendingEntitlement.find resp.dig("data", "id") rescue nil
    end

    shared_examples "a failed creation" do
      it "does not create an entitlement" do
        expect do
          post path, headers: admin_headers, params: params
        end.to keep_the_same(PendingEntitlement, :count)
          .and(have_enqueued_mail(EntitlementMailer, :pending).exactly(0).times)
          .and(have_enqueued_mail(EntitlementMailer, :created).exactly(0).times)

        expect(response).to have_http_status(422)
      end
    end

    context "with valid inputs" do
      it "creates the record correctly" do
        expect do
          post path, headers: admin_headers, params: params
        end.to change(PendingEntitlement, :count).by(1).and have_enqueued_mail(EntitlementMailer, :pending).with(a_kind_of(PendingEntitlement))

        find_created!

        expect(@created).to be_in_state(:pending)
      end

      context "when a user already exists with the given email" do
        let!(:user) { FactoryBot.create :user, email: email }

        it "creates the record correctly" do
          expect do
            post path, headers: admin_headers, params: params
          end.to change(PendingEntitlement, :count).by(1).and have_enqueued_mail(EntitlementMailer, :created).with(user, a_kind_of(Entitlement))

          find_created!

          expect(@created).to be_in_state(:success)
        end
      end
    end

    context "when the subject url is invalid" do
      let(:subject_url) { "https://google.com" }

      it_behaves_like "a failed creation"
    end

    context "when the expiration is nonsense" do
      let(:expiration) { "nonsense" }

      it_behaves_like "a failed creation"
    end

    context "with an invalid email" do
      let(:email) { "123456789" }

      it_behaves_like "a failed creation"
    end
  end

  context "when destroying an entitlement" do
    let!(:pending_entitlement) { FactoryBot.create :pending_entitlement }

    let(:path) { api_v1_pending_entitlement_path pending_entitlement }

    it "removes the pending entitlement" do
      expect do
        delete path, headers: admin_headers
      end.to change(PendingEntitlement, :count).by(-1)

      expect do
        pending_entitlement.reload
      end.to raise_error ActiveRecord::RecordNotFound

      expect(response).to have_http_status(204)
    end
  end
end
