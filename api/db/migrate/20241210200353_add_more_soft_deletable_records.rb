# frozen_string_literal: true

class AddMoreSoftDeletableRecords < ActiveRecord::Migration[6.1]
  TABLES = %i[annotations reading_groups users].freeze

  def change
    TABLES.each do |table|
      add_soft_deletion_to! table
    end

    add_index :users, :classification, unique: true, name: "udx_users_deleted",
      where: %[classification = 'deleted']
  end

  private

  def add_soft_deletion_to!(table_name)
    change_table table_name do |t|
      t.timestamp :deleted_at, null: true
      t.timestamp :marked_for_purge_at, null: true

      t.index :deleted_at
      t.index :marked_for_purge_at
    end
  end
end
