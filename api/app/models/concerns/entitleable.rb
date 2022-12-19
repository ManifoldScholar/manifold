# frozen_string_literal: true

module Entitleable
  extend ActiveSupport::Concern

  included do
    has_many :entitlements, as: :subject, dependent: :destroy
    has_many :entitlement_import_rows, as: :subject, dependent: :destroy
    has_many :pending_entitlements, as: :subject, dependent: :destroy
  end

  def entitlement_subject_url
    to_entitlement_gid.to_s
  end

  # @return [GlobalID]
  def to_entitlement_gid(**params)
    params[:app] = :entitlements

    to_global_id params
  end
end
