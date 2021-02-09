module ReadingGroups
  class Clone
    def call(reading_group:, **options)
      operation = ReadingGroups::Operations::Clone.new reading_group, options

      operation.call
    end
  end
end
