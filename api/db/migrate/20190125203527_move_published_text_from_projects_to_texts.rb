class MovePublishedTextFromProjectsToTexts < ActiveRecord::Migration[5.0]
  def up
    add_column :texts, :published, :boolean, default: false, null: false

    execute <<-SQL.squish
      UPDATE texts
        SET published = true 
        WHERE id IN (SELECT published_text_id FROM projects)
    SQL

    remove_belongs_to :projects, :published_text, type: :uuid
  end

  def down
    add_belongs_to :projects, :published_text, type: :uuid

    execute <<-SQL.squish
      UPDATE projects
        SET published_text_id = (
          SELECT texts.id
          FROM texts
          INNER JOIN projects ON texts.project_id = projects.id
          WHERE texts.published = true
          LIMIT 1
        )
    SQL

    remove_column :texts, :published
  end
end
