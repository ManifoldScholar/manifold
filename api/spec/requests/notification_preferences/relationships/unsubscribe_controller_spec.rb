# frozen_string_literal: true

RSpec.describe "NotificationPreferences Unsubscribe API", type: :request do
  let(:user) { FactoryBot.create(:user) }
  let(:token) { UnsubscribeToken.generate user }

  describe "unsubscribes a user from notifications" do
    let(:path) { api_v1_notification_preferences_relationships_unsubscribe_path }
    before { post path, params: { token: token } }

    describe "the response" do
      it "has a 201 status code" do
        expect(response).to have_http_status(:created)
      end
    end
  end
end
