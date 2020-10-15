require "charlock_holmes"

module ResourceImports
  class ParseCSV < ActiveInteraction::Base
    record :resource_import

    VALID_ENCODING = "UTF-8".freeze

    def execute
      path = resource_import.data_original(&:open)
      csv = ensure_encoding path

      rows = csv.is_a?(String) ? CSV.parse(csv) : CSV.read(csv, encoding: "bom|utf-8")
      @line_number = 0
      rows.each do |row|
        @line_number += 1
        make_row! row
      end
      resource_import
    ensure
      path.close unless path.closed?
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
      return ensure_string_io_encoding(file_path) if file_path.is_a? StringIO

      content = File.read(file_path)
      detection = CharlockHolmes::EncodingDetector.detect(content)
      return file_path if detection[:encoding] == VALID_ENCODING

      CharlockHolmes::Converter.convert content, detection[:encoding], VALID_ENCODING
    end

    def ensure_string_io_encoding(string_io)
      content = string_io.read
      detection = CharlockHolmes::EncodingDetector.detect(content)
      CharlockHolmes::Converter.convert content, detection[:encoding], VALID_ENCODING
    end

  end
end
