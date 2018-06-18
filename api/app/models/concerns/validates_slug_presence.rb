module Concerns
  module ValidatesSlugPresence
    extend ActiveSupport::Concern

    included do
      validates :slug, presence: true, allow_nil: true
    end
  end
end
