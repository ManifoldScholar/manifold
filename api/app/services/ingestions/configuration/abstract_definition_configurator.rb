module Ingestions
  module Configuration
    class AbstractDefinitionConfigurator
      include ActiveSupport::Configurable
      include Configurates

      config_accessor :interaction_namespace

      # @param [Symbol] name
      # @param [Class, nil] interaction
      def initialize(name, interaction = nil, &block)
        interaction ||= derive_interaction(name)

        if interaction.blank?
          raise Ingestions::Configuration::Error,
                "Interaction was not provided and could not be derived from #{name}"
        end

        @options = {
          name: name.to_sym,
          interaction: interaction
        }

        evaluate(&block) if block_given?
      end

      # @param [String] text
      # @return [void]
      def description(text)
        @options[:description] = text.to_s.strip_heredoc.strip
      end

      expose :description

      # @param [Symbol] name
      # @return [void]
      def insert_after(name)
        @options[:position] = [:after, name]
      end

      expose :insert_after

      # @param [Fixnum] position
      # @return [void]
      def insert_at(position)
        raise TypeError, "Invalid position: #{position}" if !position.is_a?(Integer) || position < 1

        @options[:position] = position
      end

      expose :insert_at

      # @param [Symbol] name
      # @return [void]
      def insert_before(name)
        @options[:position] = [:before, name]
      end

      expose :insert_before

      # @return [void]
      def insert_first!
        @options[:position] = :first
      end

      expose :insert_first!

      def to_h
        @options
      end

      private

      # @param [#to_s] name
      # @return [String]
      def derive_interaction(name)
        "#{interaction_namespace}::#{name.to_s.camelize}".safe_constantize
      end
    end
  end
end
