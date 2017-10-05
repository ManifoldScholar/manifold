class ApplicationMailer < ActionMailer::Base
  layout "email"
  before_action :assign_global_email_vars

  private

  def assign_global_email_vars
    @settings = Settings.instance
    @closing = @settings.email[:closing]
    @client_url = Rails.configuration.manifold.url
    @installation_name = @settings.general[:installation_name]
  end
end
