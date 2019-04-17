require Rails.root.join "lib", "paperclip_migrator"

class AddAttachmentPressLogoToSettings < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    paperclip_attachment :settings, :press_logo
  end
end
