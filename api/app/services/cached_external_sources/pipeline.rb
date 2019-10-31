module CachedExternalSources
  class Pipeline
    include Dry::Transaction(container: CachedExternalSources::Container)

    step :fetch, with: "fetch"
    step :fetch_content_type, with: "fetch_content_type"
    step :possibly_download, with: "possibly_download"
  end
end
