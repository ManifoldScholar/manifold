class MoveTextLanguageAndUniqueIdToMetadata < ActiveRecord::Migration[5.0]
  def up
    Text.all.each do |text|
      say_with_time "Updated metadata fields for text #{text.id}" do
        text.metadata["rights"] = text.rights
        text.metadata["unique_identifier"] = text.unique_identifier
        text.metadata["language"] = text.language
        text.save
      end
    end

    remove_column :texts, :rights, :string
    remove_column :texts, :unique_identifier, :string
    remove_column :texts, :language, :string
  end

  def down

    add_column :texts, :rights, :string
    add_column :texts, :unique_identifier, :string
    add_column :texts, :language, :string

    Text.all.each do |text|
      say_with_time "Rolled back moved metadata fields for text #{text.id}" do
        text.rights = text.metadata["rights"]
        text.unique_identifier = text.metadata["unique_identifier"]
        text.language = text.metadata["language"]
        text.save
      end
    end

  end

end
