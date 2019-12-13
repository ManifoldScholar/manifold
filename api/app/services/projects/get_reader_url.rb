module Projects
  class GetReaderURL < ActiveInteraction::Base
    string :frontend_url, default: proc { Rails.configuration.manifold.url }

    record :project

    # @return [String]
    def execute
      URI.join(frontend_url, "/projects/#{project.slug}").to_s
    end
  end
end
