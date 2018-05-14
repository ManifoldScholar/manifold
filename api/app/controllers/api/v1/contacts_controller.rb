module Api
  module V1
    class ContactsController < ApplicationController

      def create
        @outcome = Contacts::SendMessage.run params.dig(:data, :attributes) || {}

        if @outcome.valid?
          render status: :no_content
        else
          render json: { errors: errors }, status: :unprocessable_entity
        end
      end

      private

      def errors
        errors = []
        @outcome.errors.each do |attribute, detail|
          adjusted = attribute.to_s.camelize(:lower)
          error = { source: { pointer: "/data/attributes/#{adjusted}" }, detail: detail }
          errors.push error
        end
        errors
      end
    end
  end
end
