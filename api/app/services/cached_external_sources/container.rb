module CachedExternalSources
  # @api private
  # rubocop:disable Metrics/BlockLength
  class Container
    extend Dry::Container::Mixin

    register "fetch" do
      CachedExternalSources::Fetch.new
    end

    register "fetch_content_type" do
      CachedExternalSources::FetchContentType.new
    end

    register "possibly_download" do
      CachedExternalSources::PossiblyDownload.new
    end

    register "pipeline" do
      CachedExternalSources::Pipeline.new
    end
  end
  # rubocop:enable Metrics/BlockLength
end
