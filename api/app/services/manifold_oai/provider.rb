# frozen_string_literal: true

module ManifoldOAI
  class Provider < OAI::Provider::Base
    record_prefix "oai:manifold"

    source_model ManifoldOAI::RecordWrapper.new

    attr_accessor :manifold_settings

    def initialize(...)
      super

      self.manifold_settings = Settings.instance

      self.name = manifold_settings.oai.repository_name
      self.email = manifold_settings.oai.admin_email
      self.url = ManifoldApi::Container["system.routes"].api_oai_url
    end
  end
end
