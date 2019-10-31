module CachedExternalSources
  class PossiblyDownload
    include CachedExternalSources::Operation
    include Utility::DryHTTP::Import[http_get: "get"]

    # @param [CachedExternalSource] external_source
    # @return [Dry::Types::Result::Success<CachedExternalSource>]
    # @return [Dry::Types::Result::Failure(Symbol, String)]
    def call(external_source)
      return Success(external_source) unless external_source.needs_download?

      with_tempfile! do
        http_get.call(external_source.url, download_options) do |m|
          m.success do
            external_source.asset = @tempfile

            persist! external_source
          end

          m.failure do
            invalid_download external_source
          end
        end
      end
    end

    private

    def download_options
      {
        on_fragment: ->(fragment) { @tempfile.write fragment },
        stream_body: true
      }
    end

    # @return [void]
    def with_tempfile!
      Tempfile.open("external-source", Rails.root.join("tmp")) do |f|
        @tempfile = f

        f.binmode

        yield
      end
    end
  end
end
