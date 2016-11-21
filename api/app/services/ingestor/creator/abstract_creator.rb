module Ingestor
  module Creator
    # Abstract base class for EPUB ingestion creators
    #
    # @author Zach Davis
    class AbstractCreator
      include ::Ingestor::Loggable
      attr_writer :existing

      def initialize(logger, text)
        @logger = logger || Rails.logger
        @text = text
      end

      def find_in_set(existing, compare_attributes)
        return nil unless !existing.nil? && existing.respond_to?(:to_a)
        existing = existing.to_a.find do |model|
          match = true
          compare_attributes.each do |key, value|
            match = false if model.send(key) != value
          end
          match
        end
        existing
      end

      def attributes_with_defaults(inspector, options = {})
        clean_attributes = attributes(inspector, options).delete_if do |_key, value|
          value.blank?
        end
        self.class::DEFAULT_ATTRIBUTES.clone.merge(clean_attributes)
      end

    end
  end
end
