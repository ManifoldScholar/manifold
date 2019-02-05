module ResourceImports
  class ParseGoogleSheet < ActiveInteraction::Base
    record :resource_import

    def execute
      @line_number = 0
      sheet.rows.each do |row|
        @line_number += 1
        make_row! row
      end
      resource_import
    end

    private

    def make_row!(row)
      return unless row.any?(&:present?)

      compose ResourceImports::MakeRow,
              resource_import: resource_import,
              raw_row: row,
              line_number: @line_number
    end

    def sheet
      spreadsheet.worksheets.first
    end

    def spreadsheet
      session.spreadsheet_by_url resource_import.url
    end

    def session
      @session ||= ::Factory::DriveSession.create_service_account_session
    end

  end
end
