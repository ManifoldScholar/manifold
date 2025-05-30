# frozen_string_literal: true

# @abstract
class ApplicationDecorator < Draper::Decorator
  class << self
    def collection_decorator_class
      ApplicationCollectionDecorator
    end
  end
end
