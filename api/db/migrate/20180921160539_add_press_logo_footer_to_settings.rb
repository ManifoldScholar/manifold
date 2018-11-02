class AddPressLogoFooterToSettings < ActiveRecord::Migration[5.0]
  def change
    paperclip_attachment :settings, :press_logo_footer
    paperclip_attachment :settings, :press_logo_mobile
  end

  private

  def paperclip_attachment(table, prefix)
    reversible do |dir|
      dir.up do
        add_column table, :"#{prefix}_file_name", :string
        add_column table, :"#{prefix}_content_type", :string
        add_column table, :"#{prefix}_file_size", :integer
        add_column table, :"#{prefix}_updated_at", :timestamp
      end

      dir.down do
        %w(file_name content_type file_size updated_at).each do |suffix|
          remove_column table, :"#{prefix}_#{suffix}"
        end
      end
    end
  end
end
