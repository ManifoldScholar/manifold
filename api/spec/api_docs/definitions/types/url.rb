module ApiDocs
  module Definition
    module Types
      class Url < AbstractType

        def type
          "string"
        end

        def example?
          true
        end

        def example
          "http://some-website.com"
        end

      end
    end
  end
end
