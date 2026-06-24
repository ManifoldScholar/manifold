# frozen_string_literal: true

module Lti
  # A reference to a deep-linkable Manifold entity, carried as a (type, id) pair
  # both in a picker selection and on a launch URL's query string
  # (redirect_type / redirect_id). Resolves the pair to the actual record and
  # validates that the type is one a reading group can collect.
  #
  # Only these six collectable types are deep-linkable; everything resolves by
  # UUID (no type has a globally-unique slug we can rely on).
  class ResourceReference
    RESOLVABLE_TYPES = %w[
      Project Text TextSection Resource ResourceCollection JournalIssue
    ].freeze

    LAUNCH_PATH = "/lti/launch"

    # @param type [String] the entity class name (e.g. "Project")
    # @param id [String] the entity UUID
    def initialize(type:, id:)
      @type = type.to_s
      @id = id.to_s
    end

    attr_reader :type, :id

    # @return [ApplicationRecord, nil] the resolved record, or nil when the type
    #   is not deep-linkable or no record matches the id
    def entity
      return @entity if defined?(@entity)

      @entity = model&.find_by(id: id)
    end

    # @return [Boolean] true when the reference resolves to a real record
    def valid?
      entity.present?
    end

    # Canonical query params for the launch URL (and the client redirect channel).
    # @return [Hash]
    def redirect_params
      { redirect_type: entity.class.name, redirect_id: entity.id }
    end

    # The target_link_uri the platform stores and replays on launch. Carries the
    # resource identity in its query so the launch can resolve it back.
    # @return [String]
    def launch_url
      URI.parse(Rails.configuration.manifold.url).tap do |uri|
        uri.path = LAUNCH_PATH
        uri.query = Rack::Utils.build_nested_query(redirect_params)
      end.to_s
    end

    private

    def model
      return unless RESOLVABLE_TYPES.include?(type)

      type.constantize
    end
  end
end
