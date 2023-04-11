class AddTargetKindToIngestion < ActiveRecord::Migration[6.0]
  def change
    change_table :ingestions do |t|
      t.text :target_kind
    end

    reversible do |dir|
      dir.up do
        exec_update(<<~SQL)
        UPDATE ingestions SET target_kind = 'text';
        SQL
      end
    end

    change_column_null :ingestions, :target_kind, false
  end
end
