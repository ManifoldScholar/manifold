module Ingestions
  class Fetcher < AbstractInteraction
    string :url

    set_callback :execute, :before, :report_fetch

    def execute
      fetcher = compose Pickers::Fetcher, url: url

      compose fetcher.interaction, url: url
    end

    private

    def report_fetch
      info "services.ingestions.fetcher.log.download_external",
           url: url
    end

  end
end
