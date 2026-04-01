# frozen_string_literal: true

module SystemUpgrades
  module HasLogger
    extend ActiveSupport::Concern

    def logger
      @logger ||= build_logger
    end

    # @!attribute [r] output
    # @return [StringIO]
    def output
      @output ||= StringIO.new
    end

    private

    def build_logger
      destinations = [Logger.new(output), Rails.logger]
      destinations << Logger.new($stdout) if stdout
      ActiveSupport::BroadcastLogger.new(*destinations)
    end
  end
end
