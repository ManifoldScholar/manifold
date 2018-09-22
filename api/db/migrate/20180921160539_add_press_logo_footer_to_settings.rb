class AddPressLogoFooterToSettings < ActiveRecord::Migration[5.0]
  def self.up
    change_table :settings do |t|
      t.attachment :press_logo_footer
      t.attachment :press_logo_mobile
    end
  end

  def self.down
    remove_attachment :settings, :press_logo_footer
    remove_attachment :settings, :press_logo_mobile
  end
end
