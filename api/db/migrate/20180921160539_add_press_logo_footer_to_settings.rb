require Rails.root.join "lib", "paperclip_migrator"

class AddPressLogoFooterToSettings < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    paperclip_attachment :settings, :press_logo_footer
    paperclip_attachment :settings, :press_logo_mobile
  end
end
