module APIDocs
  module Definitions
    module Resources
      class Ingestion

        # TODO: Zach should circle back to this to make sure this makes sense
        REQUEST_ATTRIBUTES = {
          source: Types::Hash.schema(
            id: Types::Serializer::URL,
            storage: Types::String.enum("cache"),
            metadata: Types::Hash.schema(
              filename: Types::String.meta(example: "anton-chekhov_the-duel.epub"),
              size: Types::Integer.meta(example: "683346"),
              mimeType: Types::String.meta(example: "application/epub+zip")
            ).meta(
              description: 'In order to upload a source, first you must post to the "files" '\
              'route which is our TUS upload endpoint. From that, you will get a file ID, '\
              'which is included in the post to ingestions.'
            )
          )
        }.freeze

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
