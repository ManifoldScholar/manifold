class RemoveDefaultHashFromShrineFields < ActiveRecord::Migration[6.0]
  def change
    change_column_default :action_callouts, :attachment_data, from: {}, to: nil
    change_column_default :cached_external_sources, :asset_data, from: {}, to: nil
    change_column_default :features, :background_data, from: {}, to: nil
    change_column_default :features, :foreground_data, from: {}, to: nil
    change_column_default :ingestion_sources, :attachment_data, from: {}, to: nil
    change_column_default :ingestions, :source_data, from: {}, to: nil
    change_column_default :makers, :avatar_data, from: {}, to: nil
    change_column_default :project_exports, :asset_data, from: {}, to: nil
    change_column_default :projects, :cover_data, from: {}, to: nil
    change_column_default :projects, :hero_data, from: {}, to: nil
    change_column_default :projects, :avatar_data, from: {}, to: nil
    change_column_default :resource_collections, :thumbnail_data, from: {}, to: nil
    change_column_default :resource_imports, :data_data, from: {}, to: nil
    change_column_default :resources, :attachment_data, from: {}, to: nil
    change_column_default :resources, :high_res_data, from: {}, to: nil
    change_column_default :resources, :transcript_data, from: {}, to: nil
    change_column_default :resources, :translation_data, from: {}, to: nil
    change_column_default :resources, :variant_format_one_data, from: {}, to: nil
    change_column_default :resources, :variant_format_two_data, from: {}, to: nil
    change_column_default :resources, :variant_thumbnail_data, from: {}, to: nil
    change_column_default :resources, :variant_poster_data, from: {}, to: nil
    change_column_default :settings, :press_logo_data, from: {}, to: nil
    change_column_default :settings, :press_logo_footer_data, from: {}, to: nil
    change_column_default :settings, :press_logo_mobile_data, from: {}, to: nil
    change_column_default :settings, :favicon_data, from: {}, to: nil
    change_column_default :text_exports, :asset_data, from: {}, to: nil
    change_column_default :texts, :cover_data, from: {}, to: nil
    change_column_default :users, :avatar_data, from: {}, to: nil

    change_column_null :ingestions, :source_data, true

    reversible do |change|
      change.up do
        execute <<-SQL
         UPDATE action_callouts SET attachment_data = NULL WHERE attachment_data = '{}';
         UPDATE cached_external_sources SET asset_data = NULL WHERE asset_data = '{}';
         UPDATE features SET background_data = NULL WHERE background_data = '{}';
         UPDATE features SET foreground_data = NULL WHERE foreground_data = '{}';
         UPDATE ingestion_sources SET attachment_data = NULL WHERE attachment_data = '{}';
         UPDATE ingestions SET source_data = NULL WHERE source_data = '{}';
         UPDATE makers SET avatar_data = NULL WHERE avatar_data = '{}';
         UPDATE project_exports SET asset_data = NULL WHERE asset_data = '{}';
         UPDATE projects SET cover_data = NULL WHERE cover_data = '{}';
         UPDATE projects SET hero_data = NULL WHERE hero_data = '{}';
         UPDATE projects SET avatar_data = NULL WHERE avatar_data = '{}';
         UPDATE resource_collections SET thumbnail_data = NULL WHERE thumbnail_data = '{}';
         UPDATE resource_imports SET data_data = NULL WHERE data_data = '{}';
         UPDATE resources SET attachment_data = NULL WHERE attachment_data = '{}';
         UPDATE resources SET high_res_data = NULL WHERE high_res_data = '{}';
         UPDATE resources SET transcript_data = NULL WHERE transcript_data = '{}';
         UPDATE resources SET translation_data = NULL WHERE translation_data = '{}';
         UPDATE resources SET variant_format_one_data = NULL WHERE variant_format_one_data = '{}';
         UPDATE resources SET variant_format_two_data = NULL WHERE variant_format_two_data = '{}';
         UPDATE resources SET variant_thumbnail_data = NULL WHERE variant_thumbnail_data = '{}';
         UPDATE resources SET variant_poster_data = NULL WHERE variant_poster_data = '{}';
         UPDATE settings SET press_logo_data = NULL WHERE press_logo_data = '{}';
         UPDATE settings SET press_logo_footer_data = NULL WHERE press_logo_footer_data = '{}';
         UPDATE settings SET press_logo_mobile_data = NULL WHERE press_logo_mobile_data = '{}';
         UPDATE settings SET favicon_data = NULL WHERE favicon_data = '{}';
         UPDATE text_exports SET asset_data = NULL WHERE asset_data = '{}';
         UPDATE texts SET cover_data = NULL WHERE cover_data = '{}';
         UPDATE users SET avatar_data = NULL WHERE avatar_data = '{}';
        SQL
      end

      change.down do
        execute <<-SQL
         UPDATE action_callouts SET attachment_data = '{}' WHERE attachment_data IS NULL;
         UPDATE cached_external_sources SET asset_data = '{}' WHERE asset_data IS NULL;
         UPDATE features SET background_data = '{}' WHERE background_data IS NULL;
         UPDATE features SET foreground_data = '{}' WHERE foreground_data IS NULL;
         UPDATE ingestion_sources SET attachment_data = '{}' WHERE attachment_data IS NULL;
         UPDATE ingestions SET source_data = '{}' WHERE source_data IS NULL;
         UPDATE makers SET avatar_data = '{}' WHERE avatar_data IS NULL;
         UPDATE project_exports SET asset_data = '{}' WHERE asset_data IS NULL;
         UPDATE projects SET cover_data = '{}' WHERE cover_data IS NULL;
         UPDATE projects SET hero_data = '{}' WHERE hero_data IS NULL;
         UPDATE projects SET avatar_data = '{}' WHERE avatar_data IS NULL;
         UPDATE resource_collections SET thumbnail_data = '{}' WHERE thumbnail_data IS NULL;
         UPDATE resource_imports SET data_data = '{}' WHERE data_data IS NULL;
         UPDATE resources SET attachment_data = '{}' WHERE attachment_data IS NULL;
         UPDATE resources SET high_res_data = '{}' WHERE high_res_data IS NULL;
         UPDATE resources SET transcript_data = '{}' WHERE transcript_data IS NULL;
         UPDATE resources SET translation_data = '{}' WHERE translation_data IS NULL;
         UPDATE resources SET variant_format_one_data = '{}' WHERE variant_format_one_data IS NULL;
         UPDATE resources SET variant_format_two_data = '{}' WHERE variant_format_two_data IS NULL;
         UPDATE resources SET variant_thumbnail_data = '{}' WHERE variant_thumbnail_data IS NULL;
         UPDATE resources SET variant_poster_data = '{}' WHERE variant_poster_data IS NULL;
         UPDATE settings SET press_logo_data = '{}' WHERE press_logo_data IS NULL;
         UPDATE settings SET press_logo_footer_data = '{}' WHERE press_logo_footer_data IS NULL;
         UPDATE settings SET press_logo_mobile_data = '{}' WHERE press_logo_mobile_data IS NULL;
         UPDATE settings SET favicon_data = '{}' WHERE favicon_data IS NULL;
         UPDATE text_exports SET asset_data = '{}' WHERE asset_data IS NULL;
         UPDATE texts SET cover_data = '{}' WHERE cover_data IS NULL;
         UPDATE users SET avatar_data = '{}' WHERE avatar_data IS NULL;
        SQL
      end
    end
  end
end
