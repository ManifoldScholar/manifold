module ApiDocs
  module Definition
    module Resource
      class TextCategory

        READ_ONLY = [:abilities].freeze

        WRITE_ONLY = [].freeze

        ATTRIBUTES = {
          title: Type.string,
          position: Type.integer,
          abilities: Type.abilities
        }.freeze

        RELATIONSHIPS = {
          project: Type.resource
        }.freeze

        class << self

          include Resource

        end
      end
    end
  end
end
