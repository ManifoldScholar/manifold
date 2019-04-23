require Rails.root.join "lib", "paperclip_migrator"

class AddAttachmentAvatarToUsers < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    paperclip_attachment :users, :avatar
  end
end
