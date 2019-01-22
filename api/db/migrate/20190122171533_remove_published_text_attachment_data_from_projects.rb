class RemovePublishedTextAttachmentDataFromProjects < ActiveRecord::Migration[5.0]
  def change
    remove_column :projects, :published_text_attachment_data, :jsonb, default: {}
    remove_column :projects, :published_text_attachment_content_type_deprecated, :string
    remove_column :projects, :published_text_attachment_file_name_deprecated, :string
    remove_column :projects, :published_text_attachment_file_size_deprecated, :integer
    remove_column :projects, :published_text_attachment_updated_at_deprecated, :datetime
  end
end
