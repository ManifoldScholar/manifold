module Ingestions
  module Configuration
    # @api private
    class AbstractRegistry
      include HasModdableKlasses
      include Enumerable

      RELATIVE_INSERTIONS = %i[before after].freeze

      INSERT_TUPLE = lambda { |o|
        o.is_a?(Array) &&
          o.length == 2 &&
          o.first.in?(RELATIVE_INSERTIONS) &&
          o.second.is_a?(Symbol)
      }

      attr_reader :last_position

      delegate :length, :size, to: :@definitions

      moddable_klass! :configurator,
                      Ingestions::Configuration::AbstractRegistryConfigurator
      moddable_klass! :definition,
                      Ingestions::Configuration::AbstractDefinition
      moddable_klass! :definition_configurator,
                      Ingestions::Configuration::AbstractDefinitionConfigurator

      def initialize
        @definitions = Set.new
        @last_position = 0
      end

      def each
        return enum_for(__method__) unless block_given?

        @definitions.sort.each do |definition|
          yield definition
        end
      end

      # @return [Ingestions::Configuration::AbstractDefinition]
      def [](name)
        find_by_name(name) || raise(Ingestions::Configuration::UnknownDefinition,
                                    "Unknown definition: #{name}")
      end

      # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
      # @api private
      # @param [Integer, :first, (:before, Symbol), (:last, Symbol)] position
      # @param [{ Symbol => Object }] options (@see Ingestions::Configuration::AbstractDefinition#initialize)
      # @raise [Ingestions::InvalidDefinition]
      # @return [Ingestions::Configuration::AbstractDefinition]
      def add(position: nil, **options)
        raise Ingestions::Configuration::Error, "Not in a configure block; cannot add directly" unless configuring?

        options[:position] = calculate_position(position)

        new_definition = definition_klass.new options

        unless new_definition.valid?
          raise Ingestions::Configuration::InvalidDefinition,
                new_definition.errors.full_messages.to_sentence
        end

        unless @definitions.add?(new_definition)
          raise Ingestions::Configuration::AlreadyDefined,
                "Already defined: #{new_definition.name}"
        end

        each do |definition|
          next if definition == new_definition

          definition.position += 1 if definition.position >= new_definition.position
        end

        @last_position = to_a.last.position.to_i

        new_definition
      end
      # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

      def configure(&block)
        @configuring = true

        if block_given?
          configurator = configurator_klass.new self

          configurator.evaluate(&block)
        end

        self
      ensure
        @configuring = false
      end

      def configuring?
        @configuring
      end

      private

      # @param [Integer, :first, (:before, Symbol), (:last, Symbol)] value
      # @return [Integer]
      def calculate_position(value)
        case value
        when :first, 0
          1
        when INSERT_TUPLE
          calculate_relative_insertion_for(*value)
        when Integer then value
        when nil then last_position + 1
        else
          raise TypeError, "Unknown value for position: #{value.inspect}"
        end
      end

      # @param [:before, :after] relative_insertion
      # @param [Symbol] relative_to_name
      # @return [Integer]
      def calculate_relative_insertion_for(relative_insertion, relative_to_name)
        relative_position = self[relative_to_name].position

        case relative_insertion
        when :before
          relative_position
        when :after
          relative_position + 1
        else
          1
        end
      end

      def find_by_name(name)
        detect do |definition|
          definition =~ name
        end
      end

      class << self
        def abstract?
          self == Ingestions::Configuration::AbstractRegistry
        end

        def inherited(subclass)
          subclass.define_child_classes!
        end

        protected

        # @return [void]
        def define_child_classes!
          define_moddable_klasses!
        end

        private

        # rubocop:disable Metrics/MethodLength, Style/GuardClause
        def infer_defaults!(definition_definer: infer_definition_definer,
                            interaction_namespace: infer_interaction_namespace,
                            interaction_parent: "#{interaction_namespace}::Abstract#{infer_noun_klass}".safe_constantize)
          registry_klass = self

          if definition_definer.present?
            configurator do
              define_method(definition_definer) do |name, interaction = nil, &block|
                configurator = registry_klass.definition_configurator.new(name,
                                                                          interaction,
                                                                          &block)

                registry.add configurator.to_h
              end

              expose definition_definer
            end
          end

          definition { must_inherit_from! interaction_parent } if interaction_parent.present?

          if interaction_parent.present?
            definition do
              must_inherit_from! interaction_parent
            end
          end

          if interaction_namespace.present?
            definition_configurator do
              config.interaction_namespace = interaction_namespace
            end
          end
        end
        # rubocop:enable Metrics/MethodLength, Style/GuardClause

        def infer_definition_definer
          infer_noun.to_sym
        end

        def infer_interaction_namespace
          "Ingestions::#{infer_noun_klass.pluralize}"
        end

        def infer_noun
          name.demodulize.gsub(/Registry\z/, "").underscore
        end

        def infer_noun_klass
          infer_noun.camelize
        end
      end
    end
  end
end
