module ProxiedAssociations
  extend ActiveSupport::Concern

  delegate :reference_configurations, to: :class
  delegate :available_relationships, to: :class

  included do
    before_validation :reset_reference_associations!
    after_commit :reset_reference_associations!
  end

  def reset_reference_associations!
    @reference_associations = nil
  end

  def reference_associations
    @reference_associations ||= build_reference_associations
  end

  def reference_configuration(kind)
    reference_configurations.detect { |config| config.name == kind }
  end

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def build_reference_associations
    reference_configurations.each_with_object({}) do |config, h|
      h[config.name] ||= [] if config.multiple
      method = config.multiple ? :select : :detect
      cbrs = content_block_references.__send__(method) { |cbr| cbr.kind == config.name.to_s }

      h[config.name] = if config.multiple
                         cbrs.map(&:referencable).reject(&:blank?)
                       else
                         cbrs&.referencable
                       end
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity

  # rubocop:disable Naming/PredicateName
  class_methods do
    def available_relationships
      reference_configurations.map(&:name)
    end

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
      build_assocciation_id_getter(options.dig(:name))
    end

    def build_assocciation_id_getter(name)
      singular_name = name.to_s.singularize
      class_eval <<~RUBY, __FILE__, __LINE__ + 1
          def #{singular_name}_id
            association = reference_associations[:#{name}]
            return association&.pluck(:id) if association.is_a? Array
            association&.id
          end
          alias_method "#{singular_name}_ids", "#{singular_name}_id"
      RUBY
    end

    def build_association_getter(name)
      class_eval <<~RUBY, __FILE__, __LINE__ + 1
          def #{name}
            association = reference_associations[:#{name}]
            return association.compact if association.is_a? Array
            association
          end
      RUBY
    end
  end
  # rubocop:enable Naming/PredicateName
end
