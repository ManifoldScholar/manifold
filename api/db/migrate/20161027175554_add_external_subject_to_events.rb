class AddExternalSubjectToEvents < ActiveRecord::Migration[5.0]
  def change
    add_column :events, :external_subject_id, :string
    add_column :events, :external_subject_type, :string
  end
end
