module Ingestor
  # The <tt>Strategy</tt> module is used to register strategies. It is also
  # responsible for looping through all registered strategies and returning the
  # first strategy that reports that it is able to ingest the ingestion subject.
  #
  # Nota Bene: if you have multiple strategies that can ingest the same type of
  # ingestion subject, the order in which the strategies are added matters.
  # The _for_ method will return the *first* strategy that reports it can ingest
  # the ingestion subject.
  #
  # @author Zach Davis
  module Strategy
    class << self
      delegate :[], to: :strategies

      # Return the first strategy that reports that it _can_ingest_ the current
      # ingestion's text.
      #
      # @param [Ingestion] ingestion the Ingestion object that needs a
      #   strategy.
      # @return [Symbol] the class name of the first strategy that can reports
      #   it can ingest the ingestion subject.
      def for(ingestion, logger = nil)
        strategy_class = strategies.find do |_key, classname|
          result = classname.can_ingest?(ingestion)
          logger&.info "#{classname} can ingest?   #{result}"
          result
        end
        strategy_class.nil? ? nil : strategy_class.last
      end

      # Register a strategy with Manfiold.
      #
      # @param [String] label the strategy's human readable name
      # @param [Symbol] the class name of the strategy being added
      # @return [Symbol] the class name of the first strategy that can reports
      #   it can ingest the ingestion subject.
      def add(label, strategy = nil, &block)
        strategy ||= Class.new(Ingestor::Strategy::Base)
        strategy.class_eval(&block) if block_given?
        validate_strategy(label, strategy)
        strategies[label] = strategy
      end

      def clear!
        strategies.clear
      end

      def strategies
        @strategies ||= {}
      end

      private

      def validate_strategy(label, strategy)
        validate_strategy_methods(label, strategy)
        validate_strategy_base_class(label, strategy)
      end

      def validate_strategy_methods(label, strategy)
        required_methods = [:ingest, :can_ingest?]
        required_methods.each do |method|
          next if strategy.respond_to?(method)
          msg = I18n.t("services.ingestor.strategy.fail.missing_method",
                       method: method.to_s.inspect, strategy: label.inspect)
          raise NoMethodError, msg
        end
      end

      def validate_strategy_base_class(label, strategy)
        base = Ingestor::Strategy::Base
        return if strategy.ancestors.include?(base)
        raise IngestionFailed, "#{label.inspect} is not a #{base}"
      end
    end
  end
end
