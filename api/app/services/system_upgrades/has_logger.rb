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
      ActiveSupport::TaggedLogging.new(logger).tap do |l|
        l.extend(ActiveSupport::Logger.broadcast(Rails.logger))
        l.extend(ActiveSupport::Logger.broadcast(Logger.new($stdout))) if stdout
      end
    end
  end
end
