# frozen_string_literal: true

module ProvidesEntitlements
  extend ActiveSupport::Concern

  included do
    has_one :entitler, as: :entity, dependent: :destroy

    has_many :provided_entitlements, through: :entitler, source: :entitlements
  end

  # @return [Entitler]
  def to_upsertable_entitler(**metadata)
    (entitler || build_entitler).tap do |entitler|
      entitler.metadata = metadata if metadata.present?
    end
  end
end
