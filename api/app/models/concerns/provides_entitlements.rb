# frozen_string_literal: true

module ProvidesEntitlements
  extend ActiveSupport::Concern

  included do
    has_one_readonly :entitler, as: :entity

    has_many :provided_entitlements, through: :entitler, source: :entitlements
  end

  # @return [Entitler]
  def to_upsertable_entitler
    entitler || build_entitler
  end
end
