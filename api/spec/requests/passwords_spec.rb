# frozen_string_literal: true

RSpec.describe "Passwords API", type: :request do
  let_it_be(:user, refind: true) { FactoryBot.create(:user) }

  describe "reset password request" do
    describe "the response" do
      before do
        post api_v1_passwords_path, params: { email: user.email }
        user.reload
      end

      it "has a 204 status code" do
        expect(response).to have_http_status(:no_content)
      end

      it "grants a reset password token" do
        expect(user.reset_password_token).not_to be_nil
      end

      it "sets the time token was granted at" do
        expect(user.reset_password_sent_at).not_to be_nil
      end
    end
  end

  describe "account-link password reset" do
    let(:omniauth_hash) do
      OmniAuth::AuthHash.new(
        "provider" => "lti",
        "uid" => "https://canvas.example.com|user-1",
        "info" => { "email" => user.email },
        "extra" => { "target_link_uri" => "https://manifold.test/" }
      )
    end
    let(:account_link_token) { ExternalAuth::PendingIdentityLink.build(omniauth_hash, user).persist! }

    before { Rails.cache.clear }

    it "derives the account from the token, ignoring a mismatched email" do
      other = FactoryBot.create(:user)
      post api_v1_passwords_path, params: { email: other.email, account_link_token: account_link_token }

      expect(response).to have_http_status(:no_content)
      expect(user.reload.reset_password_token).to be_present
      expect(other.reload.reset_password_token).to be_nil
    end

    it "keeps the parked link alive past its original TTL" do
      token = account_link_token

      Timecop.travel(14.minutes.from_now) { post api_v1_passwords_path, params: { account_link_token: token } }

      Timecop.travel(20.minutes.from_now) do
        expect(ExternalAuth::PendingIdentityLink.find(token)).to be_present
      end
    end

    it "shortens the reset window to the account-link TTL" do
      user.generate_reset_token

      Timecop.travel(16.minutes.from_now) do
        put "/api/v1/passwords/update", params: {
          password: "testtest1234", password_confirmation: "testtest1234",
          reset_token: user.reset_password_token, account_link_token: account_link_token
        }
      end

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "update password request" do
    let(:update_params) do
      {
        password: "testtest1234",
        password_confirmation: "testtest1234",
        reset_token: user.reset_password_token
      }
    end

    describe "the response" do
      before do
        user.generate_reset_token
        put '/api/v1/passwords/update', params: update_params
        user.reload
      end

      it "has a 200 status code" do
        expect(response).to have_http_status(:ok)
      end

      it "updates the user's password" do
        expect(user.authenticate(update_params[:password])).to be_truthy
      end
    end
  end
end
