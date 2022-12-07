# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  layout "email"

  before_action :assign_global_email_vars

  private

  def assign_global_email_vars
    @settings = Settings.instance
    @closing = @settings.email[:closing]
    @api_routes = ManifoldApi::Container["system.routes"]
    @client_url = Rails.configuration.manifold.url
    @installation_name = @settings.general[:installation_name]
  end

  def hide_valediction
    @closing = nil
  end
end
