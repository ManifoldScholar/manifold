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
