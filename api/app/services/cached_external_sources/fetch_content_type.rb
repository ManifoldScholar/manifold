module CachedExternalSources
  class FetchContentType
    include CachedExternalSources::Operation
    include Utility::DryHTTP::Import[http_head: "head"]

    # @param [CachedExternalSource] external_source
    # @return [Dry::Types::Result::Success<CachedExternalSource>]
    # @return [Dry::Types::Result::Failure(Symbol, String)]
    def call(external_source)
      return Success(external_source) if external_source.content_type?

      http_head.call(external_source.url, follow_redirects: true) do |m|
        m.success do |response|
          content_type = response.content_type

          if content_type.present?
            external_source.content_type = content_type

            persist! external_source
          else
            invalid_content_type(external_source)
          end
        end

        m.failure do
          invalid_content_type(external_source)
        end
      end
    end
  end
end
