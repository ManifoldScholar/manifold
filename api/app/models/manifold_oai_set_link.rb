# frozen_string_literal: true

class ManifoldOAISetLink < ApplicationRecord
  belongs_to :manifold_oai_set, inverse_of: :manifold_oai_set_links
  belongs_to :manifold_oai_record, inverse_of: :manifold_oai_set_links

  scope :by_spec, ->(spec) { joins(:manifold_oai_set).merge(ManifoldOAISet.by_spec(spec)) }
end
