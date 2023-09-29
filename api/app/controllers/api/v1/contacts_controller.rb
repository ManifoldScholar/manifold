# frozen_string_literal: true

module API
  module V1
    class ContactsController < ApplicationController
      def create
        @outcome = Contacts::SendMessage.run contact_params&.dig(:data)&.dig(:attributes) || {}

        if @outcome.valid?
          render status: :no_content
        else
          render json: { errors: errors_for(@outcome) }, status: :unprocessable_entity
        end
      end

      private

      # @param [ActiveInteraction::Base, #errors] outcome
      # @return [<Hash>]
      def errors_for(outcome)
        outcome.errors.each_with_object([]) do |error, errors|
          attribute = error.attribute

          # This is called detail for historical reasons, but it is actually the message.
          detail = error.message

          adjusted = attribute.to_s.camelize(:lower)

          new_error = { source: { pointer: "/data/attributes/#{adjusted}" }, detail: detail }

          errors.push new_error
        end
      end
    end
  end
end
