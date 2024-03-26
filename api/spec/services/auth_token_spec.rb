# frozen_string_literal: true

RSpec.describe AuthToken do
  let_it_be(:real_email) { "test@example.com" }
  let_it_be(:email) { "test+alias@example.com" }
  let_it_be(:user, refind: true) { FactoryBot.create :user, :admin, email: email }

  let(:encoded_token) { AuthToken.encode_user(user) }

  describe ".decode" do
    it "handles a valid token correctly" do
      expect(described_class.decode(encoded_token)).to include(user_id: user.id)
    end

    it "raises an exception with an invalid token" do
      expect do
        described_class.decode "InvalidTokenData"
      end.to raise_error JWT::DecodeError
    end

    it "raises an exception with a nil token" do
      expect do
        described_class.decode nil
      end.to raise_error JWT::DecodeError
    end

    it "raises an exception with a blank token" do
      expect do
        described_class.decode ""
      end.to raise_error JWT::DecodeError
    end
  end

  describe ".authorized_admin?" do
    it "handles a valid token correctly" do
      expect(described_class.authorized_admin?("Bearer #{encoded_token}")).to eq true
    end

    it "handles invalid tokens correctly" do
      expect(described_class.authorized_admin?("Bearer InvalidTokenData")).to eq false
    end

    it "handles an empty header correctly", :aggregate_failures do
      expect(described_class.authorized_admin?("")).to eq false
      expect(described_class.authorized_admin?(nil)).to eq false
      expect(described_class.authorized_admin?("Bearer")).to eq false
    end
  end

  describe ".real_email_for" do
    it "handles a valid token correctly" do
      expect(described_class.real_email_for("Bearer #{encoded_token}")).to eq real_email
    end

    it "handles invalid tokens correctly" do
      expect(described_class.real_email_for("Bearer InvalidTokenData")).to be_nil
    end

    it "handles an empty header correctly", :aggregate_failures do
      expect(described_class.real_email_for("")).to be_nil
      expect(described_class.real_email_for(nil)).to be_nil
      expect(described_class.real_email_for("Bearer")).to be_nil
    end
  end
end
