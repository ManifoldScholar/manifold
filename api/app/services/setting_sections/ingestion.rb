# frozen_string_literal: true

module SettingSections
  # Settings related to the {Ingestion} process.
  class Ingestion < Base
    attribute :global_styles, :string, default: ""
    attribute :mammoth_style_map, :string, default: ""
  end
end
