# Model concern that includes relations to collaborators and scoped relations to creators
# and contributors
module Collaborative
  extend ActiveSupport::Concern

  included do
    has_many :collaborators
    has_many :makers, through: :collaborators
    has_many :creators,
             -> { where '"collaborators"."role" = ?', "creator" },
             through: :collaborators,
             source: "maker"
    has_many :contributors,
             -> { where '"collaborators"."role" = ?', "contributor" },
             through: :collaborators,
             source: "maker"
  end

  def creator_names
    creators.pluck(:name).join(", ")
  end
end
