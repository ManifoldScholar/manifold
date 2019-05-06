module Concerns
  module View
    extend ActiveSupport::Concern

    def readonly?
      true
    end
  end
end
