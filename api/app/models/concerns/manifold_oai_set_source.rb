# frozen_string_literal: true

module ManifoldOAISetSource
  extend ActiveSupport::Concern

  included do
    has_one :manifold_oai_set, as: :source, inverse_of: :source, dependent: :nullify

    after_save :manage_oai_set!
  end

  # @api private
  # @return [void]
  def manage_oai_set!
    if should_have_oai_set?
      synchronize_oai_set!
    else
      ManifoldOAISet.where(source: self).destroy_all
    end
  end

  # @abstract This method should be overridden in models where it is included
  #  in order to determine whether or not a set should exist.
  def should_have_oai_set?
    true
  end

  # @see ManifoldOAI::SetSynchronizer
  # @return [void]
  def synchronize_oai_set!
    ManifoldApi::Container["manifold_oai.synchronize_set"].(self).value!
  end
end
