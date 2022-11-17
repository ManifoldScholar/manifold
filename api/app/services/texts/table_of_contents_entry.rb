# frozen_string_literal: true

module Texts
  class TableOfContentsEntry
    include Utility::EnhancedStoreModel

    attribute :id, :string
    attribute :type, :string
    attribute :label, :string
    attribute :anchor, :string
    attribute :uid, :string
    attribute :source_path, :string
    attribute :collected, :boolean
    attribute :children, to_array_type

    validates :children, store_model: { allow_blank: true }

    # @return [void]
    def ensure_uid!
      self.uid ||= SecureRandom.uuid

      children.each(&:ensure_uid!) if children.present?
    end
  end
end
