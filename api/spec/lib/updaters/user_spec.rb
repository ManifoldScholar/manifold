# frozen_string_literal: true

RSpec.describe Updaters::User do
  context "when changing an existing user's email" do
    let!(:old_email) { Faker::Internet.unique.email }
    let!(:new_email) { Faker::Internet.unique.email }

    let!(:user) { FactoryBot.create :user, email: old_email }

    let(:params) do
      {
        data: {
          attributes: {
            email: new_email,
          },
          relationships: {},
        },
      }.with_indifferent_access
    end

    before do
      user.mark_email_confirmed!
    end

    it "de-confirms their email and sends a request to the user to re-confirm their email address" do
      expect do
        described_class.new(params).update(user)
      end.to change { user.reload.email_confirmed }.from(true).to(false)
        .and have_enqueued_mail(AccountMailer, :email_confirmation)
    end
  end
end
