# frozen_string_literal: true

module SettingSections
  class OAI < Base
    attribute :repository_name, default: "Manifold"
    attribute :admin_email, default: "admin@manifold.app"
  end
end
