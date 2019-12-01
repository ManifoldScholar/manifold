class AddCachesForTextSummaries < ActiveRecord::Migration[5.2]
  def change
    add_column :text_titles, :cached_value_formatted, :string
    add_column :texts, :cached_description_formatted, :string
    add_column :makers, :cached_full_name, :string
  end
end
