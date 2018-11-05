class AddAttachmentAvatarToUsers < ActiveRecord::Migration
  include PaperclipMigrator

  def change
    paperclip_attachment :users, :avatar
  end
end
