module ApiDocs
  module Definition
    module Types
      class Id < AbstractType

        def example?
          true
        end

        def example
          "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
        end

        def type
          "string"
        end

      end
    end
  end
end
