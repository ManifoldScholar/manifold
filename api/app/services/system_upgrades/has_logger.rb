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
      ActiveSupport::TaggedLogging.new(Logger.new(output))
    end
  end
end
