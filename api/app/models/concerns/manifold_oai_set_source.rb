# frozen_string_literal: true

module ManifoldOAISetSource
  extend ActiveSupport::Concern

  include ManifoldOAI::DeclarativeAttributes

  ABSTRACT_ATTRIBUTES = %i[set_name set_description set_category].freeze

  included do
    has_one :manifold_oai_set, as: :source, inverse_of: :source, dependent: :nullify

    after_save :manage_oai_set!
  end

  class_methods do
    # @param [Object, Proc, Symbol] category
    # @param [Object, Proc, Symbol] name
    # @param [Object, Proc, Symbol] description
    # @param [Object, Proc, Symbol] spec
    # @option options [Object, Proc, Symbol] :if condition gating the set's existence
    # @return [void]
    def oai_set(category: nil, name: nil, description: nil, spec: nil, **options)
      define_oai_attributes(set_category: category, set_name: name, set_description: description, set_spec: spec)

      return unless options.key?(:if)

      condition = options[:if]
      define_method(:should_have_oai_set?) { !exclude_from_oai && resolve_oai_attribute(condition) }
    end
  end

  ABSTRACT_ATTRIBUTES.each do |attribute|
    define_method(attribute) do
      raise NotImplementedError, "#{self.class} must declare `#{attribute}` via `oai_set` (ManifoldOAISetSource)"
    end
  end

  # @api private
  # @return [void]
  def manage_oai_set!
    if should_have_oai_set?
      synchronize_oai_set!
    elsif exclude_from_oai
      ManifoldOAISet.where(source: self).delete_all
    else
      ManifoldOAISet.where(source: self).destroy_all
    end
  end

  # @abstract This method should be overridden in models where it is included
  #  in order to determine whether or not a set should exist.
  def should_have_oai_set?
    !exclude_from_oai
  end

  def set_spec
    slug.tr("-", "_").camelize(:lower)
  end

  # @see ManifoldOAI::SetSynchronizer
  # @return [void]
  def synchronize_oai_set!
    ManifoldApi::Container["manifold_oai.synchronize_set"].(self).value!
  end
end
