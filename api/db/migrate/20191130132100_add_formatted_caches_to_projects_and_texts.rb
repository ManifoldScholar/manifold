class AddFormattedCachesToProjectsAndTexts < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :cached_title_formatted, :string
    add_column :projects, :cached_subtitle_formatted, :string
    add_column :projects, :cached_title_plaintext, :string
    add_column :projects, :cached_subtitle_plaintext, :string
    add_column :text_titles, :cached_value_plaintext, :string
    add_column :texts, :cached_description_plaintext, :string
  end
end
