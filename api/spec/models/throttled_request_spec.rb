# frozen_string_literal: true

RSpec.describe ThrottledRequest, type: :model do
  describe ".track!" do
    let_it_be(:email) { "test@example.com" }
    let_it_be(:user, refind: true) { FactoryBot.create :user, email: email }

    let(:path) { "/test/path" }

    let(:request_path) { URI.join("http://example.com", path).to_s }
    let(:ip) { "10.0.0.1" }
    let(:auth_token) { AuthToken.encode_user user }
    let(:authorization_header) { "Bearer #{auth_token}" }

    let(:headers) do
      {
        "HTTP_AUTHORIZATION" => authorization_header,
        "REMOTE_ADDR" => ip,
      }
    end

    let(:request) { Rack::Request.new(Rack::MockRequest.env_for(request_path, headers)) }

    it "handles a normal request correctly" do
      expect do
        described_class.track!(request)
      end.to execute_safely
        .and change(described_class.where(ip: ip), :count).by(1)
        .and change(described_class.where(email: email), :count).by(1)
    end

    context "when the authorization header is malformed" do
      let(:authorization_header) { "Bearer InvalidTokenData" }

      it "treats it as unauthenticated" do
        expect do
          described_class.track!(request)
        end.to execute_safely
          .and change(described_class.where(ip: ip), :count).by(1)
          .and change(described_class.where(email: ""), :count).by(1)
      end
    end
  end
end
