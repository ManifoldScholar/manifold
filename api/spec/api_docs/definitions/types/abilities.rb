module ApiDocs
  module Definition
    module Types
      class Abilities < Object

        def properties?
          true
        end

        def properties
          {
            create: Type.boolean,
            read: Type.boolean,
            update: Type.boolean,
            delete: Type.boolean
          }
        end

      end
    end
  end
end
