module ApiDocs
  module Definition
    module Types
      class Upload < Types::Object

        def properties?
          true
        end

        def properties
          {
            filename: Type.boolean,
            data: Type.string,
            contentType: Type.string
          }
        end

      end
    end
  end
end
