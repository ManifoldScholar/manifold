class CreateProjectSubjectTable < ActiveRecord::Migration[5.0]
  def change
    create_table :project_subjects do |t|
      t.uuid :project_id, foreign_key: true
      t.uuid :subject_id, foreign_key: true
    end
  end
end
