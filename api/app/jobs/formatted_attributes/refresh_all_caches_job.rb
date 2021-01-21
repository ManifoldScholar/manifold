module FormattedAttributes
  class RefreshAllCachesJob < ApplicationJob
    queue_as :default

    MODEL_NAMES = %w[
      Event
      Feature
      Page
      Project
      ProjectCollection
      Resource
      ResourceCollection
      Settings
      Text
      TextTitle
    ].freeze

    # @return [void]
    def perform(synchronous: false)
      MODEL_NAMES.each do |model_name|
        FormattedAttributes::RefreshModelCachesJob.perform_later model_name, synchronous: synchronous
      end
    end
  end
end
