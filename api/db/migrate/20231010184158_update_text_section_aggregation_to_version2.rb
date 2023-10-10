class UpdateTextSectionAggregationToVersion2 < ActiveRecord::Migration[6.1]
  def change
    update_view :text_section_aggregations, version: 2, revert_to_version: 1
  end
end
