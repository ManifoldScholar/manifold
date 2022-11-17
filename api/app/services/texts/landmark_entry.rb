# frozen_string_literal: true

module Texts
  class LandmarkEntry
    include Utility::EnhancedStoreModel

    attribute :source_path, :string
    attribute :type, :string
    attribute :label, :string
    attribute :anchor, :string

    def toc?
      type == "toc"
    end
  end
end
