class AddCourseInformationToReadingGroups < ActiveRecord::Migration[6.0]
  def change
    change_table :reading_groups do |t|
      t.jsonb :course, null: false, default: {}

      t.index :course, using: :gin
    end
  end
end
