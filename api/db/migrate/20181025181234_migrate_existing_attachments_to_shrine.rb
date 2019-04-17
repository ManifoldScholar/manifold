require Rails.root.join "lib", "paperclip_migrator"

using Refinements::HandleRenamedCollections

class MigrateExistingAttachmentsToShrine < ActiveRecord::Migration[5.0]
  def change
    remove_column :projects, :avatar_meta, :jsonb, default: {}, null: false # This is handled by attachments concern now

    attachment_map = {
      "ResourceCollection" => [:thumbnail],
      "Feature" => [:background, :foreground],
      "IngestionSource" => [:attachment],
      "Maker" => [:avatar],
      "Project" => [:cover, :hero, :avatar, :published_text_attachment],
      "ResourceImport" => [:data],
      "Resource" => [:attachment, :high_res, :transcript, :translation,
                 :variant_format_one, :variant_format_two, :variant_thumbnail, :variant_poster],
      "Settings" => [:press_logo, :press_logo_footer, :press_logo_mobile],
      "User" => [:avatar]
    }

    reversible do |dir|
      dir.up do
        attachment_map.each do |klass, attachments|
          attachments.each do |attachment|
            say_with_time "Migrating #{klass}##{attachment.to_s} from paperclip to shrine" do
              PaperclipMigrator.migrate_all! klass.constantize,
                                             attachment,
                                             :small, :small_square, :small_landscape,
                                             :small_portrait, :medium, :medium_square,
                                             :medium_landscape, :medium_portrait, :large_landscape
            end

            %w(file_name content_type file_size updated_at).each do |suffix|
              column_name = "#{attachment}_#{suffix}"
              rename_column klass.constantize.table_name, column_name.to_sym, "#{column_name}_deprecated".to_sym
            end
          end
        end
      end

      dir.down do
        attachment_map.each do |klass, attachments|
          attachments.each do |attachment|
            say_with_time "Restoring #{klass}##{attachment.to_s} paperclip columns" do
              %w(file_name content_type file_size updated_at).each do |suffix|
                column_name = "#{attachment}_#{suffix}"
                rename_column klass.constantize.table_name, "#{column_name}_deprecated".to_sym, column_name.to_sym
              end
            end
          end
        end
      end
    end
  end
end
