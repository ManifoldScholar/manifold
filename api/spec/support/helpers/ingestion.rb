module TestHelpers
  module IngestionHelper
    def create_context(ingestion)
      context = Ingestions::Context.new(ingestion) do |ctx|
        fetched = Ingestions::Fetcher.run(ctx.to_fetcher_inputs).result if ctx.url?

        ctx.source = fetched
      end

      context
    end
  end
end
