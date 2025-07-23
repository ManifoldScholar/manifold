class AddReaderDisplayFormatToAnnotations < ActiveRecord::Migration[7.0]
  def change
    add_column :annotations, :reader_display_format, :text
  end
end
