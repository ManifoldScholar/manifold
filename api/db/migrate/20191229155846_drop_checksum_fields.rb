class DropChecksumFields < ActiveRecord::Migration[5.2]
  def change
    remove_column :resource_collections, :thumbnail_checksum, :string

    remove_column :resources, :high_res_checksum, :string
    remove_column :resources, :transcript_checksum, :string
    remove_column :resources, :translation_checksum, :string
    remove_column :resources, :attachment_checksum, :string

  end
end
