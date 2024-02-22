# frozen_string_literal: true

module SettingSections
  # The general section for settings that affect interactions and usage of Manifold.
  #
  # @see Settings
  class General < Base
    DEFAULT_RESTRICTED_ACCESS_HEADING = "Access to this project is restricted."
    DEFAULT_RESTRICTED_ACCESS_BODY = "Only users granted permission may view this project's texts, resources, and other content."

    attribute :installation_name, :string, default: "Manifold"
    attribute :head_title, :string, default: "Manifold Scholarship"
    attribute :head_description, :string, default: "Transforming scholarly publications into living digital works"
    attribute :social_share_message, default: "Shared from Manifold Scholarship"

    attribute :all_standalone, :boolean, default: false
    attribute :library_disabled, :boolean, default: false
    attribute :restricted_access, :boolean, default: false
    attribute :restricted_access_heading, :string, default: DEFAULT_RESTRICTED_ACCESS_HEADING
    attribute :restricted_access_body, :string, default: DEFAULT_RESTRICTED_ACCESS_BODY

    attribute :disable_engagement, :boolean, default: false
    attribute :disable_public_reading_groups, :boolean, default: false
    attribute :disable_reading_groups, :boolean, default: false
    attribute :disable_spam_detection, :boolean, default: false
    attribute :disable_internal_analytics, :boolean, default: false

    attribute :contact_email, :string
    attribute :copyright, :string
    attribute :default_publisher, :string
    attribute :default_publisher_place, :string
    attribute :facebook, :string
    attribute :home_redirect_url, :string
    attribute :library_redirect_url, :string
    attribute :press_site, :string
    attribute :terms_url, :string
    attribute :twitter, :string

    alias public_reading_groups_disabled? disable_public_reading_groups

    delegate :restricted_access_body_formatted, to: :parent, allow_nil: true

    # This gets doubly exposed in the serializer.
    expose! :restricted_access_body_formatted

    # @return [String]
    def default_restricted_access_heading
      restricted_access_heading.presence || DEFAULT_RESTRICTED_ACCESS_HEADING
    end

    # @return [String]
    def default_restricted_access_body
      restricted_access_body.presence || DEFAULT_RESTRICTED_ACCESS_BODY
    end
  end
end
