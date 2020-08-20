# Simple job to create a new event in the background.
class CreateEventJob < ApplicationJob
  include ExclusiveJob

  queue_as :default

  rescue_from(::Factory::Errors::NoEventProject) do
    # do nothing, don't retry
  end

  rescue_from(::Factory::Errors::NoEventSubject) do
    # do nothing, don't retry
  end

  def perform(event_type, **args)
    Factory::Event.new.create(event_type, args)
  end
end
