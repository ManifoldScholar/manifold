class AddIndicesForStatistics < ActiveRecord::Migration[5.0]
  def change
    add_index :annotations, :format
    add_index :annotations, :created_at, using: :BRIN
    add_index :comments, :created_at, using: :BRIN
    add_index :texts, :created_at, using: :BRIN
  end
end
