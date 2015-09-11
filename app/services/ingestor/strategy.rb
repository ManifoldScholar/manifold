# Code heavily influenced by corresponding Warden module
module Ingestor
  module Strategy
    class << self

      def for(ingestion)
        strategy_class = strategies.find do |key, classname|
          classname.can_ingest?(ingestion)
        end
        strategy_class.nil? ? nil : strategy_class.last
      end

      def add(label, strategy = nil, &block)
        strategy ||= Class.new(Ingestor::Strategy::Base)
        strategy.class_eval(&block) if block_given?

        required_methods = [:ingest, :can_ingest?]
        required_methods.each do |method|
          unless strategy.respond_to?(method)
            raise NoMethodError, "#{method.to_s.inspect} is not declared in the #{label.inspect} strategy"
          end
        end

        base = Ingestor::Strategy::Base
        unless strategy.ancestors.include?(base)
          raise "#{label.inspect} is not a #{base}"
        end

        strategies[label] = strategy
      end

      def [](label)
        strategies[label]
      end

      def clear!
        strategies.clear
      end

      def strategies
        @strategies ||= {}
      end

    end
  end
end
