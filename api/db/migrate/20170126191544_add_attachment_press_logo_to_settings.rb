class AddAttachmentPressLogoToSettings < ActiveRecord::Migration[5.0]
  def self.up
    change_table :settings do |t|
      t.attachment :press_logo
    end
  end

  def self.down
    remove_attachment :settings, :press_logo
  end
end
