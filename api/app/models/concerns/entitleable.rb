module Entitleable
  extend ActiveSupport::Concern

  included do
    has_many :entitlements, as: :subject, dependent: :destroy
  end

  # @return [GlobalID]
  def to_entitlement_gid(**params)
    params[:app] = :entitlements

    to_global_id params
  end
end
