# frozen_string_literal: true

module ManifoldOAISetLinkSource
  extend ActiveSupport::Concern

  included do
    has_one :manifold_oai_set_link, dependent: :destroy, as: :source
    after_save :manage_oai_set_link!
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

  # @abstract
  # The OAI set to link to.
  def oai_set
    nil
  end

  # @abstract
  # The OAI record to link to.
  def oai_record
    nil
  end

  # @see ManifoldOAI::SetSynchronizer
  # @return [void]
  def synchronize_oai_set_link!
    ManifoldApi::Container["manifold_oai.synchronize_set_link"].(oai_set, [oai_record], link_source: self).value!
  end
end
