# frozen_string_literal: true

module ManifoldOAIRecordSource
  extend ActiveSupport::Concern

  include ManifoldOAI::DeclarativeAttributes

  included do
    has_one :manifold_oai_record, as: :source, inverse_of: :source, dependent: :nullify

    after_save :manage_oai_record!
    around_destroy :mark_oai_record_deleted!
  end

  class_methods do
    # @option options [Object, Proc, Symbol] :if condition gating the record's existence
    # @return [void]
    def oai_record(**options)
      return unless options.key?(:if)

      condition = options[:if]
      define_method(:should_have_oai_record?) { !exclude_from_oai && resolve_oai_attribute(condition) }
    end
  end

  # @api private
  # @return [void]
  def manage_oai_record!
    if should_have_oai_record?
      synchronize_oai_record!
    elsif exclude_from_oai
      ManifoldOAIRecord.where(source: self).delete_all
    else
      ManifoldOAIRecord.where(source: self, deleted_at: nil).update_all(deleted_at: Time.current)
    end
  end

  def mark_oai_record_deleted!
    record = manifold_oai_record
    yield
    record&.touch(:deleted_at)
  end

  # @abstract This method should be overridden in models where it is included
  #  in order to determine whether or not a record should exist.
  def should_have_oai_record?
    !exclude_from_oai
  end

  # @see ManifoldOAI::RecordSynchronizer
  # @return [void]
  def synchronize_oai_record!
    ManifoldApi::Container["manifold_oai.synchronize_record"].(self).value!
  end

  def canonical_url
    client_url = Rails.configuration.manifold.url
    route = model_name.plural
    "#{client_url}/#{route}/#{slug}"
  end

  # @see ManifoldOAI::DublinCoreDocument
  # @return [String]
  def oai_dc_document
    ManifoldOAI::DublinCoreDocument.from_record_source(self)
  end
end
