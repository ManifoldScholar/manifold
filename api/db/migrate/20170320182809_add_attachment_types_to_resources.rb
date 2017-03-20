class AddAttachmentTypesToResources < ActiveRecord::Migration[5.0]
  def self.up
    change_table :resources do |t|
      t.attachment :variant_format_one
      t.attachment :variant_format_two
      t.attachment :variant_thumbnail
      t.attachment :variant_poster
    end
  end

  def self.down
    remove_attachment :resources, :variant_format_one
    remove_attachment :resources, :variant_format_two
    remove_attachment :resources, :variant_thumbnail
    remove_attachment :resources, :variant_poster
  end
end
