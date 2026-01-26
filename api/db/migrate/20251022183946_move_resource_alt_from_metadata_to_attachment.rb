class MoveResourceAltFromMetadataToAttachment < ActiveRecord::Migration[7.0]
  def up
    say_with_time "Migrating metadata.alt_text to attachment_data.metadata.alt_text for images" do
      exec_update(<<~SQL)
      WITH migrated_alt_text AS (
        SELECT id AS resource_id,
          jsonb_set(attachment_data, '{metadata,alt_text}', metadata -> 'alt_text') AS new_attachment_data
        FROM resources
        WHERE
          kind = 'image'
          AND
          metadata ->> 'alt_text' IS NOT NULL
          AND
          attachment_data IS NOT NULL
          AND
          attachment_data #>> '{metadata,alt_text}' IS NULL
      )
      UPDATE resources r SET attachment_data = mat.new_attachment_data
      FROM migrated_alt_text AS mat
      WHERE mat.resource_id = r.id;
      SQL
    end
  end

  def down
    # Intentionally left blank
  end
end
