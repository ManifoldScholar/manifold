class CreateJournals < ActiveRecord::Migration[6.0]
  def change
    create_table :journals, id: :uuid do |t|
      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.string :title
      t.string :subtitle
      t.text :description
      t.string :instagram_id
      t.string :twitter_id
      t.string :website_url

      t.string :facebook_id
      t.jsonb :metadata, default: {}
      t.uuid :creator_id, foreign_key: { to_table: :users }
      t.string :slug
      t.boolean :draft, default: true, null: false
      t.citext :sort_title
      t.integer :events_count, default: 0
      t.jsonb :cover_data
      t.jsonb :hero_data
      t.integer :hero_layout
      t.jsonb :custom_icon_data
      t.jsonb :social_image_data
      t.text :social_description
      t.text :social_title
      t.jsonb :avatar_data
      t.string "hashtag"
      t.text "image_credits"
      t.string "avatar_color", default: "primary"
      t.integer :journal_issues_count, default: 0, null: false
      t.integer :journal_volumes_count, default: 0, null: false
      t.jsonb :fa_cache, default: {}, null: false
      t.index ["slug"], name: "index_journals_on_slug", unique: true
    end

    create_table :journal_volumes, id: :uuid do |t|
      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
      t.uuid :journal_id, foreign_key: true, null: false
      t.uuid :creator_id, foreign_key: { to_table: :users }
      t.integer :number
      t.text :subtitle
      t.integer :journal_issues_count, default: 0, null: false
      t.index :journal_id
      t.index :creator_id
    end

    create_table :journal_issues, id: :uuid do |t|
      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
      t.uuid :journal_id, foreign_key: true, null: false
      t.uuid :journal_volume_id, foreign_key: true
      t.uuid :project_id, foreign_key: true, null: false
      t.uuid :creator_id, foreign_key: { to_table: :users }
      t.integer :number
      t.text :subtitle
      t.index :journal_id
      t.index :journal_volume_id
      t.index :project_id, unique: true
      t.index :creator_id
    end

    create_table :journal_subjects do |t|
      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
      t.uuid :journal_id, foreign_key: true, null: false
      t.uuid :subject_id, foreign_key: true, null: false
      t.index :journal_id
      t.index :subject_id
    end

    reversible do |change|
      change.up do
        say_with_time 'migrating action_callouts to polymorphic parent' do
          add_reference :action_callouts, :calloutable, type: :uuid, polymorphic: true, index: true
          update "UPDATE action_callouts SET calloutable_type = 'Project', calloutable_id = project_id"
          remove_reference :action_callouts, :project, type: :uuid, index: true
        end
      end
      change.down do
        add_reference :action_callouts, :project, type: :uuid, index: true
        update "UPDATE action_callouts SET project_id = calloutable_id WHERE calloutable_type = 'Project'"
        remove_reference :action_callouts, :calloutable, type: :uuid, polymorphic: true, index: true
      end
    end

  end
end
