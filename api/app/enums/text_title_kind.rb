class TextTitleKind < ClassyEnum::Base
  include ActiveSupport::Configurable

  config.gepub_type = nil

  def gepub_type
    config.gepub_type
  end

  def has_gepub_type?
    gepub_type.present?
  end

  class << self
    # @return [void]
    def inherit_gepub_type!
      expected_name = name.demodulize.underscore.upcase

      config.gepub_type = "GEPUB::TITLE_TYPE::#{expected_name}".constantize
    end
  end
end

class TextTitleKind::Main < TextTitleKind
  inherit_gepub_type!
end

class TextTitleKind::Acronym < TextTitleKind
end

class TextTitleKind::Abbreviated < TextTitleKind
end

class TextTitleKind::Alternative < TextTitleKind
end

class TextTitleKind::AlternativeCover < TextTitleKind
end

class TextTitleKind::AlternativeBack < TextTitleKind
end

class TextTitleKind::Expanded < TextTitleKind
  inherit_gepub_type!
end

class TextTitleKind::Former < TextTitleKind
end

class TextTitleKind::Translated < TextTitleKind
end

class TextTitleKind::Subtitle < TextTitleKind
  inherit_gepub_type!
end

class TextTitleKind::Short < TextTitleKind
  inherit_gepub_type!
end

class TextTitleKind::Collection < TextTitleKind
  inherit_gepub_type!
end

class TextTitleKind::Edition < TextTitleKind
  inherit_gepub_type!
end
