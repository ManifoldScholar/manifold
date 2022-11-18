class TextSectionAggregation < ApplicationRecord

  # Associations
  belongs_to :text, inverse_of: :text_section_aggregation

end
