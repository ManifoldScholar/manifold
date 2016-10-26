# Simple job to create a new event in the background.
class CreateEventJob < ApplicationJob
  queue_as :default

  def perform(event_type, **args)
    Factory::Event.new.create(event_type, args)
  end
end
