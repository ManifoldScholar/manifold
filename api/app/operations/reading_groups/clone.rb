module ReadingGroups
  class Clone
    def call(reading_group:, **options)
      operation = ReadingGroups::Operations::Clone.new reading_group, options

      operation.call
    end

    class Options < Types::FlexibleStruct
      attribute? :name, Types::String.optional
      attribute? :archive, Types::Bool.default { false }
      attribute? :clone_owned_annotations, Types::Bool.default { false }
    end
  end
end
