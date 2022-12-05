# frozen_string_literal: true

module EntitlementImports
  module WritesMessages
    extend ActiveSupport::Concern

    included do
      include Dry::Effects.State(:log_messages)
    end

    # @param [String] message
    # @return [void]
    def log!(message, now: Time.current)
      log_messages << "[#{now.iso8601}] #{message}"

      return
    end
  end
end
