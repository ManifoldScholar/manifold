class AddEventSubtitleToEvents < ActiveRecord::Migration[5.0]
  def change
    add_column :events, :event_subtitle, :string
  end
end
