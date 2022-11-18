class CreateTextSectionAggregations < ActiveRecord::Migration[6.0]
  def change
    create_view :text_section_aggregations
  end
end
