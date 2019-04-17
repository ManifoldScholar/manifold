require Rails.root.join "lib", "paperclip_migrator"

class AddAttachmentPublishedTextToProjects < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    paperclip_attachment :projects, :published_text_attachment
  end
end
