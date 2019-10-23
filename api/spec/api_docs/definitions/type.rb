module ApiDocs
  module Definition
    class Type

      class << self

        def method_missing(type, **options)
          klass_name = "ApiDocs::Definition::Types::#{type.to_s.camelize}"
          klass_name.constantize.new(options).render
        end
      end

    end
  end
end
