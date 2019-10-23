module ApiDocs
  module Definition
    module Types
      class Collection < Types::Object

        def properties?
          true
        end

        def properties
          {
            data: Type.array({ items: Type.pointer })
          }
        end

      end
    end
  end
end
