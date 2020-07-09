module Attachments
  class FileReplacer < ActiveInteraction::Base
    string :klass_name
    string :replacement_dir
    string :field_name, default: "attachment"
    boolean :dry_run, default: false
    interface :logger, default: Rails.logger

    def execute
      replace_attachments!
    end

    private

    def replace_attachments!
      replacement_files.each { |path| find_and_replace(path) }
    end

    def find_and_replace(path)
      models = models_for_filename(path)
      return unless models.present?

      models.each do |model|
        if dry_run
          report! "Will replace #{klass_name}[#{model.id}] ##{field_name} with \"#{File.basename(path)}\""
        else
          replace_model_attachment(model, path)
        end
      end
    end

    def replace_model_attachment(model, path)
      model.__send__("#{field_name}=", File.open(path))

      if model.save
        report! "Replaced #{klass_name}[#{model.id}] ##{field_name} with \"#{File.basename(path)}\""
      else
        report_error! "Error replacing #{klass_name}[#{model.id}] #{field_name} with \"#{File.basename(path)}\"",
                      model.errors.full_messages
      end
    end

    def models_for_filename(path)
      filename = ActiveRecord::Base.connection.quote(File.basename(path))
      models_with_cached_attachments.where("#{column_name} -> 'metadata' ->> 'filename' = #{filename}")
    end

    def models_with_cached_attachments
      @models_with_cached_attachments ||= klass.where("#{column_name} ->> 'storage' = 'cache'")
    end

    def replacement_files
      Dir.glob(File.join(replacement_dir, "*")).select { |path| File.file?(path) }
    end

    def klass
      klass_name.constantize
    end

    def column_name
      "#{field_name}_data"
    end

    def report!(msg)
      logger.info msg
    end

    def report_error!(msg, errors)
      error_message = errors.join("/n    ")
      logger.error msg + error_message
    end

  end
end
