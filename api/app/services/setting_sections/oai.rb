# frozen_string_literal: true

module SettingSections
  class OAI < Base
    attribute :repository_name, default: "Manifold"
    attribute :admin_email, default: "admin@manifold.app"
    attribute :directory_enabled, :boolean, default: true

    def directory_enabled_changed_to_true?(previous_oai)
      return false if previous_oai.nil?

      !previous_oai.directory_enabled? && directory_enabled?
    end
  end
end
