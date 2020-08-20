module ValidatesSlugPresence
  extend ActiveSupport::Concern

  included do
    validates :slug, presence: true, uniqueness: true, allow_nil: true
  end
end
