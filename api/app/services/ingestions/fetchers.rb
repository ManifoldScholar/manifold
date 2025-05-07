# frozen_string_literal: true

module Ingestions
  module Fetchers
    class NotFetchable < IngestionError; end
    class FetchFailed < IngestionError; end
  end
end
