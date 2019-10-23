module ApiDocs
  class Config

    class << self
      include Helpers::Inflections

      def swagger_root
        File.join(__dir__, "../../swagger")
      end

      def definitions
        defined = {}
        ApiDocs::Definition::Resource.constants.each do |resource_class|
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
            host: "localhost:3020", # TODO: base this off the .env file
            basePath: "/api/v1",
            schemes: ["http"],
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
