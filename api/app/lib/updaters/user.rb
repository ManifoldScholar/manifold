# frozen_string_literal: true

module Updaters
  # Updates a User model from JSON-API style params
  class User
    include ::Updaters

    after_save :unsubscribe!

    around_save :maybe_reconfirm!

    def attachment_fields
      [:avatar]
    end

    def adjusted_attributes
      return {} unless attributes

      clone = attributes.clone
      clone.delete(:unsubscribe)
      clone
    end

    private

    # @return [void]
    def maybe_reconfirm!
      @was_confirmed = @model.email_confirmed?

      yield

      @now_confirmed = @model.email_confirmed?

      @model.request_email_confirmation! if @was_confirmed && !@now_confirmed
    end

    def unsubscribe!
      return unless attributes[:unsubscribe].present?

      @model.unsubscribe_all
    end
  end
end
