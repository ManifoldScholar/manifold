# frozen_string_literal: true

# @see ManifoldOAIRecordSource
# @see ManifoldOAISet
class ManifoldOAIRecord < ApplicationRecord
  belongs_to :source, polymorphic: true, optional: true

  has_many :manifold_oai_set_links, inverse_of: :manifold_oai_record, dependent: :destroy

  has_many :sets, through: :manifold_oai_set_links, source: :manifold_oai_set

  scope :in_provider_order, -> { order(id: :asc) }

  scope :since_identifier, ->(identifier) { where(arel_table[:identifier].gt(identifier)) if identifier.present? }

  def to_oai_dc
    oai_dc_content
  end

  class << self
    # @param [String, nil] spec
    # @return [ActiveRecord::Relation<ManifoldOAIRecord>]
    def by_set(spec = nil)
      return all if spec.blank?

      where(id: ManifoldOAISetLink.by_spec(spec).select(:manifold_oai_record_id))
    end

    # @param [String] selector
    # @return [ActiveRecord::Relation<ManifoldOAIRecord>]
    def lookup(selector)
      identifier = selector.to_s.gsub(/\Amanifold:oai:/, "")

      find_by(id: identifier)
    end
  end
end
