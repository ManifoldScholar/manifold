module ApiDocs
  module Definition
    module Types
      class Resource < Types::Object

        def properties?
          true
        end

        def properties
          {
            data: Type.pointer
          }
        end

      end
    end
  end
end
