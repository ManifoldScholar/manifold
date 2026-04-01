# frozen_string_literal: true

# rubocop:disable Rails/ApplicationJob
class AsyncApplicationJob < ActiveJob::Base
  self.queue_adapter = :async unless Rails.env.test?
end
# rubocop:enable Rails/ApplicationJob
