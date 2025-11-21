class UpdateTextSectionNodeLinksToVersion2 < ActiveRecord::Migration[7.0]
  def change
  
    update_view :text_section_node_links, version: 2, revert_to_version: 1
  end
end
