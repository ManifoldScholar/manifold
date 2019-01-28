using Refinements::HandleRenamedCollections

class AddFriendlyIdToModels < ActiveRecord::Migration[5.0]
  def change

    create_table :friendly_id_slugs do |t|
      t.string   :slug,           :null => false
      t.integer  :sluggable_id,   :null => false
      t.string   :sluggable_type, :limit => 50
      t.string   :scope
      t.datetime :created_at
    end
    add_index :friendly_id_slugs, :sluggable_id
    add_index :friendly_id_slugs, [:slug, :sluggable_type], length: { slug: 140, sluggable_type: 50 }
    add_index :friendly_id_slugs, [:slug, :sluggable_type, :scope], length: { slug: 70, sluggable_type: 50, scope: 70 }, unique: true
    add_index :friendly_id_slugs, :sluggable_type

    add_column :projects, :slug, :string
    add_index :projects, :slug, unique: true

    add_column :texts, :slug, :string
    add_index :texts, :slug, unique: true

    add_column :collections, :slug, :string
    add_index :collections, :slug, unique: true

    add_column :resources, :slug, :string
    add_index :resources, :slug, unique: true

    reversible do |change|

      change.up do
        %w(Text Project ResourceCollection Resource).each do |klass|
          klass.constantize.reset_column_information
          klass.constantize.find_each(&:save)
        end
      end

    end

  end

end
