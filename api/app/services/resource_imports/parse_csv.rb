module ResourceImports
  class ParseCSV < ActiveInteraction::Base
    record :resource_import

    def execute
      rows = CSV.read resource_import.data.path
      @line_number = 0
      rows.each do |row|
        @line_number += 1
        make_row! row
      end
      resource_import
    end

    private

    def make_row!(row)
      compose ResourceImports::MakeRow,
              resource_import: resource_import,
              raw_row: row,
              line_number: @line_number
    end

  end
end
