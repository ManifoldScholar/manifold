module ApiDocs
  module Definition
    module Types
      class Pointer < Types::Object

        def properties?
          true
        end

        def properties
          {
            id: Type.id,
            type: Type.string
          }
        end

      end
    end
  end
end
