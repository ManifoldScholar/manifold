# frozen_string_literal: true

module ManifoldOAISetLinkSource
  extend ActiveSupport::Concern

  include ManifoldOAI::DeclarativeAttributes

  ABSTRACT_ATTRIBUTES = %i[oai_set oai_record].freeze

  included do
    has_one :manifold_oai_set_link, dependent: :destroy, as: :source
    after_save :manage_oai_set_link!
  end

  class_methods do
    # @param [Object, Proc, Symbol] set
    # @param [Object, Proc, Symbol] record
    # @option options [Object, Proc, Symbol] :if condition gating the link's existence
    # @return [void]
    def oai_set_link(set: nil, record: nil, **options)
      define_oai_attributes(oai_set: set, oai_record: record, should_have_oai_set_link?: options[:if])
    end
  end

  ABSTRACT_ATTRIBUTES.each do |attribute|
    define_method(attribute) do
      raise NotImplementedError, "#{self.class} must declare `#{attribute}` via `oai_set_link` (ManifoldOAISetLinkSource)"
    end
  end

  # @api private
  # @return [void]
  def manage_oai_set_link!
    if should_have_oai_set_link?
      synchronize_oai_set_link!
    else
      ManifoldOAISetLink.where(source: self).destroy_all
    end
  end

  # @abstract This method should be overridden in models where it is included
  #  in order to determine whether or not a set link should exist.
  def should_have_oai_set_link?
    true
  end

  # @see ManifoldOAI::SetSynchronizer
  # @return [void]
  def synchronize_oai_set_link!
    return unless oai_set.present? && oai_record.present?

    ManifoldApi::Container["manifold_oai.synchronize_set_link"].(oai_set, [oai_record], link_source: self).value!
  end
end
