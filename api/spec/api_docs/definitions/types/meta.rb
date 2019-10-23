module ApiDocs
  module Definition
    module Types
      class Meta < Types::Object

        def properties?
          true
        end

        def properties
          { partial: Type.boolean }
        end

      end
    end
  end
end
