module Ingestions
  module Configuration
    # @abstract
    class AbstractDefinition
      include ActiveSupport::Configurable
      include ActiveModel::Model
      include Dux.comparable(:position)
      include Equalizer.new(:name)

      delegate :inherited_from, :inherited_from?, :valid_interaction?, to: :class

      validates :name, :interaction, :position, presence: true
      validates :position, numericality: { integer_only: true,
                                           greater_than_or_equal_to: 1 }
      validate :must_have_a_valid_interaction!, if: :inherited_from?

      def initialize(name:, interaction:, position:, description: "")
        @name         = name.to_sym
        @interaction  = interaction
        @position     = position
        @description  = description.to_s
      end

      attr_reader :name, :interaction, :description
      attr_accessor :position

      def =~(other)
        name.to_s == other.to_s
      end

      # @return []
      def call(**inputs)
        @interaction.run(inputs)
      end

      private

      # @return [void]
      def must_have_a_valid_interaction!
        return if valid_interaction?(@interaction)

        errors.add :interaction, "does not inherit from #{inherited_from.name}"
      end

      class << self
        # @return [Class, nil]
        def inherited_from
          config.inherited_from
        end

        def inherited_from?
          Dux.inherits(ActiveInteraction::Base).call(inherited_from)
        end

        # @param [Class] klass
        # @return [void]
        def must_inherit_from!(klass)
          config.inherited_from = klass
        end

        def valid_interaction?(interaction)
          return unless inherited_from?

          Dux.inherits(inherited_from)[interaction]
        end
      end
    end
  end
end
