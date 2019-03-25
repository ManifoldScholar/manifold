Rails.application.configure do
  # config.lograge.base_controller_class = "ApplicationController::API"
  config.lograge.custom_options = lambda do |_event|
    { request_time: Time.current }
  end
end
