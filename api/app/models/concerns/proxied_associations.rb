module Concerns
  module ProxiedAssociations
    extend ActiveSupport::Concern

    delegate :reference_configurations, to: :class

    included do
      after_commit :reset_reference_associations!
    end

    def reset_reference_associations!
      @reference_associations = nil
    end

    def reference_associations
      @reference_associations ||= build_reference_associations
    end

    def reference_configuration(kind)
      reference_configurations.find { |config| config.name == kind }
    end

    # rubocop:disable Metrics/LineLength, Metrics/AbcSize
    def build_reference_associations
      content_block_references.reload if persisted?

      reference_configurations.each_with_object({}) do |config, h|
        h[config.name] ||= [] if config.multiple
        method = config.multiple ? :select : :detect

        cbrs = content_block_references.__send__(method) { |cbr| cbr.kind == config.name.to_s }

        h[config.name] = if config.multiple
                           cbrs.map(&:referencable)
                         else
                           cbrs&.referencable
                         end
      end
    end
    # rubocop:enable Metrics/LineLength, Metrics/AbcSize

    # rubocop:disable Naming/PredicateName
    class_methods do
      def reference_configurations
        @reference_configurations ||= []
      end

      def has_one_proxied(name, source:, required: false)
        configure_association multiple: false,
                              name: name,
                              source: source,
                              required: required
      end

      def has_many_proxied(name, source:, required: false)
        configure_association multiple: true,
                              name: name,
                              source: source,
                              required: required
      end

      def configure_association(**options)
        reference_configurations << Content::ReferenceConfiguration.new(**options)
        build_association_getter options.dig(:name)
      end

      def build_association_getter(name)
        class_eval <<~RUBY, __FILE__, __LINE__ + 1
          def #{name}
            reference_associations[:#{name}]
          end
        RUBY
      end
    end
    # rubocop:enable Naming/PredicateName
  end
end
