class AddFaCacheToTextSections < ActiveRecord::Migration[6.1]
  def change
    add_column :text_sections, :fa_cache, :jsonb, default: {}, null: false

    reversible do |dir|
      dir.up do
        say_with_time "Populating text_sections.fa_cache" do
          TextSection.reset_column_information
          TextSection.where.not(metadata: [nil, {}]).find_each do |section|
            section.refresh_formatted_attributes_cache!
          end
        end
      end
    end
  end
end
