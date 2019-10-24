module ApiDocs
  module Definition
    module Types
      class Date < AbstractType

        def type
          "string"
        end

        def format?
          true
        end

        def format
          "date"
        end

      end
    end
  end
end
