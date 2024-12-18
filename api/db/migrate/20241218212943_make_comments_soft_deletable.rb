# frozen_string_literal: true

class MakeCommentsSoftDeletable < ActiveRecord::Migration[6.1]
  def change
    change_table :comments do |t|
      t.timestamp :deleted_at, null: true
      t.timestamp :marked_for_purge_at, null: true

      t.index :deleted_at
      t.index :marked_for_purge_at
    end
  end
end
