require Rails.root.join "lib", "paperclip_migrator"

class AddFieldsToResources < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    rename_column :resources, :name, :title
    rename_column :resources, :type, :kind
    remove_column :resources, :project_id, :integer
    add_column :resources, :project_id, :uuid
    add_column :resources, :caption, :text
    add_column :resources, :description, :text
    add_column :resources, :fingerprint, :string
    add_column :resources, :keywords, :text
    add_column :resources, :alt_text, :string
    add_column :resources, :copyright_status, :string
    add_column :resources, :copyright_holder, :string
    add_column :resources, :credit, :string
    add_column :resources, :external_url, :string
    add_column :resources, :external_id, :string
    add_column :resources, :external_type, :string
    add_column :resources, :allow_high_res, :boolean, default: true
    add_column :resources, :allow_download, :boolean, default: true
    add_column :resources, :doi_requested, :boolean, default: false
    add_column :resources, :doi_added, :datetime
    add_column :resources, :doi, :string, default: false
    add_column :resources, :high_res_checksum, :string
    add_column :resources, :transcript_checksum, :string
    add_column :resources, :translation_checksum, :string
    add_column :resources, :attachment_checksum, :string
    paperclip_attachment :resources, :high_res
    paperclip_attachment :resources, :transcript
    paperclip_attachment :resources, :translation
  end
end
