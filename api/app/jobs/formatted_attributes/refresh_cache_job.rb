module FormattedAttributes
  # Refresh an individual model's formatted attributes cache
  #
  # @see HasFormattedAttributes#refresh_formatted_attributes_cache!
  class RefreshCacheJob < ApplicationJob
    queue_as :default

    discard_on ActiveJob::DeserializationError, ActiveRecord::RecordNotFound

    # @param [HasFormattedAttributes] model
    # @return [void]
    def perform(model)
      model.refresh_formatted_attributes_cache!
    end
  end
end
