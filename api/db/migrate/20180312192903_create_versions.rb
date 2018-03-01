# This migration creates the `versions` table, the only schema PT requires.
# All other migrations PT provides are optional.
class CreateVersions < ActiveRecord::Migration[5.0]

  def change
    create_table :versions, id: :uuid do |t|
      t.string   :item_type, null: false
      t.uuid     :item_id,   null: false
      t.belongs_to :parent_item, type: :uuid, polymorphic: true
      t.string   :event,     null: false
      t.string   :whodunnit
      t.jsonb    :object
      t.jsonb    :object_changes

      # Known issue in MySQL: fractional second precision
      # -------------------------------------------------
      #
      # MySQL timestamp columns do not support fractional seconds unless
      # defined with "fractional seconds precision". MySQL users should manually
      # add fractional seconds precision to this migration, specifically, to
      # the `created_at` column.
      # (https://dev.mysql.com/doc/refman/5.6/en/fractional-seconds.html)
      #
      # MySQL users should also upgrade to rails 4.2, which is the first
      # version of ActiveRecord with support for fractional seconds in MySQL.
      # (https://github.com/rails/rails/pull/14359)
      #
      t.datetime :created_at
    end
    add_index :versions, %i(item_type item_id)
    add_index :versions, :created_at, using: :BRIN
  end
end
