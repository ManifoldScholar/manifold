module ApiDocs
  module Definition
    module Types
      class DateTime < AbstractType

        def type
          "string"
        end

        def format?
          true
        end

        def format
          "date-time"
        end

      end
    end
  end
end
