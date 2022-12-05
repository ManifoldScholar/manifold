# frozen_string_literal: true

module EntitlementImports
  class CaptureLogs
    include Dry::Effects::Handler.State(:log_messages)

    # @param [ApplicationRecord#messages] loggable
    # @return [void]
    def call(loggable)
      messages = Array(loggable.messages)

      new_messages, result = with_log_messages(messages) do
        yield
      end

      return result
    ensure
      loggable.update_column :messages, new_messages if new_messages
    end
  end
end
