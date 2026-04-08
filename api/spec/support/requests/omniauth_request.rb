# frozen_string_literal: true

RSpec.shared_context "omniauth request" do
  before do
    OmniAuth.config.test_mode = true
  end
end
