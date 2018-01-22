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
      logger = Logger.new(output)
      logger.extend(ActiveSupport::Logger.broadcast(Rails.logger))
      logger.extend(ActiveSupport::Logger.broadcast(Logger.new(STDOUT))) if stdout
      ActiveSupport::TaggedLogging.new(logger)
    end
  end
end
