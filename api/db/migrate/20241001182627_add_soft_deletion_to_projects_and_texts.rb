# frozen_string_literal: true

class AddSoftDeletionToProjectsAndTexts < ActiveRecord::Migration[6.1]
  TABLES = %i[projects texts].freeze

  def change
    TABLES.each do |table|
      add_soft_deletion_to! table
    end
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
