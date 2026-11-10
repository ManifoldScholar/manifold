# frozen_string_literal: true

require "rails_helper"

RSpec.describe AccountMailer, type: :mailer do
  let(:user) { FactoryBot.create(:user) }

  describe "#reset_password" do
    it "embeds the account link token in the reset URL when present" do
      body = described_class.reset_password(user, account_link_token: "tok-123").body.encoded
      expect(body).to include("account_link_token=tok-123")
    end

    it "omits the token from a plain reset" do
      body = described_class.reset_password(user).body.encoded
      expect(body).not_to include("account_link_token")
    end
  end
end
