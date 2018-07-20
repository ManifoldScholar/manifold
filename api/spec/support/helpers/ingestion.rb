module TestHelpers
  module IngestionHelper
    def create_context(ingestion)
      context = Ingestions::Context.new(ingestion) do |ctx|
        fetched = compose Ingestions::Fetcher, ctx.to_fetcher_inputs if ctx.url?

        ctx.source = fetched
      end

      context
    end
  end
end
