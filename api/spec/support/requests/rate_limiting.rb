# frozen_string_literal: true

RSpec.shared_context "rack-attack rate limiting" do
  after(:each) do
    # Clear the rack-attack cache after every request spec.
    Rack::Attack.reset!
  end
end

RSpec.configure do |config|
  config.include_context "rack-attack rate limiting", type: :request
end
