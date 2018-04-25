require "charlock_holmes/string"

module ResourceImports
  class ParseCSV < ActiveInteraction::Base
    record :resource_import

    VALID_ENCODING = "UTF-8".freeze

    def execute
      csv = ensure_encoding(resource_import.data.path)
      rows = CSV.parse csv
      @line_number = 0
      rows.each do |row|
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

    def ensure_encoding(file_path)
      content = File.read(file_path)
      detection = CharlockHolmes::EncodingDetector.detect(content)
      return content if detection[:encoding] == VALID_ENCODING
      CharlockHolmes::Converter.convert content, detection[:encoding], "UTF-8"
    end
  end
end
