class AddShrineAttachmentColumnsToModels < ActiveRecord::Migration[5.0]
  def change
    add_column :collections, :thumbnail_data, :jsonb, default: {}
    add_column :features, :background_data, :jsonb, default: {}
    add_column :features, :foreground_data, :jsonb, default: {}
    add_column :ingestion_sources, :attachment_data, :jsonb, default: {}
    add_column :makers, :avatar_data, :jsonb, default: {}
    add_column :projects, :cover_data, :jsonb, default: {}
    add_column :projects, :hero_data, :jsonb, default: {}
    add_column :projects, :avatar_data, :jsonb, default: {}
    add_column :projects, :published_text_attachment_data, :jsonb, default: {}
    add_column :resource_imports, :data_data, :jsonb, default: {}
    add_column :resources, :attachment_data, :jsonb, default: {}
    add_column :resources, :high_res_data, :jsonb, default: {}
    add_column :resources, :transcript_data, :jsonb, default: {}
    add_column :resources, :translation_data, :jsonb, default: {}
    add_column :resources, :variant_format_one_data, :jsonb, default: {}
    add_column :resources, :variant_format_two_data, :jsonb, default: {}
    add_column :resources, :variant_thumbnail_data, :jsonb, default: {}
    add_column :resources, :variant_poster_data, :jsonb, default: {}
    add_column :settings, :press_logo_data, :jsonb, default: {}
    add_column :settings, :press_logo_footer_data, :jsonb, default: {}
    add_column :settings, :press_logo_mobile_data, :jsonb, default: {}
    add_column :users, :avatar_data, :jsonb, default: {}
  end
end
