module ApiDocs
  class Config

    class << self
      include Helpers::Inflections

      def swagger_root
        File.join(__dir__, "../../swagger")
      end

      def definitions
        defined = {}
        ApiDocs::Definitions::Resources.constants.each do |resource_class|
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
