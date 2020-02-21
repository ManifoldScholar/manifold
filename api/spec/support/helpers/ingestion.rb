module TestHelpers
  module IngestionHelper
    def create_context(ingestion, logger = nil)
      context = Ingestions::Context.new(ingestion, logger) do |ctx|
        fetched = Ingestions::Fetcher.run(ctx.to_fetcher_inputs).result if ctx.url?

        ctx.source = fetched
      end

      context
    end
  end
end
