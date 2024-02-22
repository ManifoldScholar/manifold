# frozen_string_literal: true

module SpamMitigation
  module Akismet
    class Config < Types::FlexibleStruct
      attribute? :api_key, Types::String.optional.default { Settings.current.secrets.akismet_api_key }
      attribute? :blog, Types::String.default { Rails.application.config.manifold.url }

      def enabled?
        api_key.present? && blog.present?
      end
    end
  end
end
