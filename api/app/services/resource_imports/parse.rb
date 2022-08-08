module ResourceImports
  class Parse < ActiveInteraction::Base
    record :resource_import

    def execute
      resource_import.reload
      begin
        if resource_import.attached_data?
          compose ResourceImports::ParseCSV, inputs
        elsif resource_import.google_sheet?
          compose ResourceImports::ParseGoogleSheet, inputs
        end
        compose ResourceImports::Automap, inputs
      rescue StandardError => e
        handle_parse_error(e)
      end
      save_and_reload
    end

    private

    def handle_parse_error(error)
      resource_import.parse_error = true
      Rails.logger.warn(
        "Unable to parse resource import data. Actual error was #{error}"
      )
      errors.add(:source, "Unable to parse resource data.")
    end

    def save_and_reload
      resource_import.save
      resource_import.resource_import_rows.reload
      resource_import
    end

  end
end
