# frozen_string_literal: true

class ManifoldOAIRecord < ApplicationRecord
  belongs_to :source, polymorphic: true, optional: true

  def to_oai_dc
    oai_dc_content
  end
end
