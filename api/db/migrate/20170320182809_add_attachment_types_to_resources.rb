require Rails.root.join "lib", "paperclip_migrator"

class AddAttachmentTypesToResources < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    paperclip_attachment :resources, :variant_format_one
    paperclip_attachment :resources, :variant_format_two
    paperclip_attachment :resources, :variant_thumbnail
    paperclip_attachment :resources, :variant_poster
  end
end
