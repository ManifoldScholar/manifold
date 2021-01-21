module FormattedAttributes
  class RefreshModelCachesJob < ApplicationJob
    queue_as :default

    discard_on FormattedAttributes::InvalidModel, NameError

    # @param [String] model_name
    # @return [void]
    def perform(model_name, synchronous: false)
      model = model_name.constantize

      raise FormattedAttributes::InvalidModel, "#{model_name.inspect} has no caches" unless valid_model?(model)

      model.refresh_all_formatted_attribute_caches! synchronous: synchronous
    end

    private

    def valid_model?(model)
      model.is_a?(Class) && model < HasFormattedAttributes
    end
  end
end
