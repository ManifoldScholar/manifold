# frozen_string_literal: true

module APIDocs
  class Config
    class << self
      include Helpers::Inflections

      def swagger_root
        Rails.public_path.join('api/static/docs')
      end

      def definitions
        defined = {}
        APIDocs::Definitions::Resources.constants.each do |resource_class|
          next unless resource_klass(resource_class).respond_to?(:resource_response)

          defined[resource_class] = resource_klass(resource_class).send(:resource_response)
        end
        defined
      end

      def swagger_docs
        {
          "v1/swagger.json" => {
            swagger: "2.0",
            info: {
              title: "Manifold",
              version: "v1"
            },
            basePath: "/api/v1",
            paths: {},
            securityDefinitions: {
              apiKey: {
                type: "apiKey",
                name: "Authorization",
                in: "header"
              }
            },
            definitions: definitions
          }
        }
      end
    end
  end
end
