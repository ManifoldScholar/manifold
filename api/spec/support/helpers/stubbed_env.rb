# frozen_string_literal: true

module TestHelpers
  module StubENV
    def stub_env(key_or_hash, value = nil)
      stubbed_hash =
        if key_or_hash.kind_of?(Hash)
          key_or_hash
        else
          { key_or_hash => value }
        end

      stub_const("ENV", ENV.to_h.merge(stubbed_hash))
    end
  end
end

RSpec.configure do |config|
  config.include TestHelpers::StubENV
end
