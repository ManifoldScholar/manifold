# frozen_string_literal: true

RSpec.describe "Email Confirmations" do
  let!(:user) { FactoryBot.create :user, password: password, password_confirmation: password }

  context "GET /api/v1/email_confirmations/:user_id" do
    it "confirms with the right token" do
      expect do
        get api_v1_email_confirmation_path(user, token: user.email_confirmation_token)
      end.to change { user.reload.email_confirmed }.from(false).to(true)

      expect(response).to have_http_status(302)
    end

    it "does not confirm with an invalid token" do
      expect do
        get api_v1_email_confirmation_path(user, token: "something invalid")
      end.to keep_the_same { user.reload.email_confirmed }

      expect(response).to have_http_status(302)
    end

    it "does not confirm with a missing token" do
      expect do
        get api_v1_email_confirmation_path(user, token: nil)
      end.to keep_the_same { user.reload.email_confirmed }

      expect(response).to have_http_status(302)
    end
  end

  context "PUT /api/v1/email_confirmations/:user_id" do
    context "as an admin" do
      it "can request an email confirmation for another user" do
        expect do
          put api_v1_email_confirmation_path(user), headers: admin_headers
        end.to have_enqueued_mail(AccountMailer, :email_confirmation)

        expect(response).to have_http_status(204)
      end
    end

    context "as a regular user" do
      let(:current_token) { token user, password }
      let(:current_headers) { build_headers current_token }

      it "can request an email confirmation for the current user" do
        expect do
          put api_v1_email_confirmation_path(user), headers: current_headers
        end.to have_enqueued_mail(AccountMailer, :email_confirmation)

        expect(response).to have_http_status(204)
      end

      it "cannot request an email confirmation for a different user" do
        other_user = FactoryBot.create :user

        expect do
          put api_v1_email_confirmation_path(other_user), headers: current_headers
        end.not_to have_enqueued_mail(AccountMailer, :email_confirmation)

        expect(response).to have_http_status(403)
      end
    end
  end
end
