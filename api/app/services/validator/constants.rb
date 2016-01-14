module Validator
  # Constants for HTML and CSS Validation
  module Constants
    MAX_WIDTH = 650
    CSS_SCOPE_SELECTOR = ".manifold-text-section"
    CSS_PROPERTY_BLACKLIST = %w(position font-family overflow overflow-x overflow-y
                                z-index)
    CSS_SELECTOR_BLACKLIST = %w(* html body @font-face )
    TAG_A_CSS_PROPERTY_BLACKLIST = %w(color)
    TAG_ATTRIBUTE_BLACKLIST = %w(accept accept-charset accesskey async autofocus border
                                 bgcolor challenge charset code codebase color cols
                                 content contenteditable defer draggable dropzone height
                                 id keytype language manifest required sandbox shape size
                                 sizes tabindex width align)
  end
end
