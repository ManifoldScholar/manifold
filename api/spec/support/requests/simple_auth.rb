# frozen_string_literal: true

RSpec.shared_context "simple auth request" do
  let(:current_user) { FactoryBot.create :user }

  let(:auth_token) do
    current_user.then do |user|
      AuthToken.encode user_id: user.id if user
    end
  end

  let(:bearer_token) do
    "Bearer #{auth_token}" if auth_token.present?
  end

  let(:auth_headers) do
    {
      "Accepts" => "application/vnd.api+json",
      "Authorization" => bearer_token,
      "Content-Type" => "application/vnd.api+json",
    }.compact
  end
end
