module Validator
  # Constants for HTML and CSS Validation
  module Constants
    MAX_WIDTH = 650
    CSS_SCOPE_SELECTOR = ".manifold-text-section".freeze
    CSS_PROPERTY_BLACKLIST = %w(position font-family overflow overflow-x overflow-y
                                z-index).freeze
    CSS_SELECTOR_BLACKLIST = %w(* html body @font-face ).freeze
    TAG_A_CSS_PROPERTY_BLACKLIST = %w(color).freeze
    TAG_H1_CSS_PROPERTY_BLACKLIST = %w(font-family font-weight size line-height margin
                                       margin-top margin-bottom margin-left margin-right
                                       padding padding-top padding-bottom padding-left
                                       padding-right color).freeze
    TAG_H2_CSS_PROPERTY_BLACKLIST = %w(font-family font-weight size line-height margin
                                       margin-top margin-bottom margin-left margin-right
                                       padding padding-top padding-bottom padding-left
                                       padding-right color).freeze
    TAG_H3_CSS_PROPERTY_BLACKLIST = %w(font-family font-weight size line-height margin
                                       margin-top margin-bottom margin-left margin-right
                                       padding padding-top padding-bottom padding-left
                                       padding-right color).freeze
    TAG_H4_CSS_PROPERTY_BLACKLIST = %w(font-family font-weight size line-height margin
                                       margin-top margin-bottom margin-left margin-right
                                       padding padding-top padding-bottom padding-left
                                       padding-right color).freeze
    TAG_H5_CSS_PROPERTY_BLACKLIST = %w(font-family font-weight size line-height margin
                                       margin-top margin-bottom margin-left margin-right
                                       padding padding-top padding-bottom padding-left
                                       padding-right color).freeze
    TAG_H6_CSS_PROPERTY_BLACKLIST = %w(font-family font-weight size line-height margin
                                       margin-top margin-bottom margin-left margin-right
                                       padding padding-top padding-bottom padding-left
                                       padding-right color).freeze
    TAG_ATTRIBUTE_BLACKLIST = %w(accept accept-charset accesskey async autofocus border
                                 bgcolor challenge charset code codebase color cols
                                 content contenteditable defer draggable dropzone height
                                 keytype language manifest required sandbox shape size
                                 sizes tabindex width align).freeze
    CSS_VALUE_MAP = {
      "xx-small" => ".7em",
      "x-small" => ".7em",
      "small" => ".8em",
      "medium" => "1em",
      "large" => "1.2em",
      "x-large" => "1.3em",
      "xx-large" => "1.3em"
    }.freeze
  end
end
