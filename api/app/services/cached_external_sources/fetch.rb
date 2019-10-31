module CachedExternalSources
  class Fetch
    include CachedExternalSources::Operation

    # @param [String] url
    # @return [Dry::Monads::Result::Success(CachedExternalSource)]
    def call(url)
      Success CachedExternalSource.fetch url
    end
  end
end
