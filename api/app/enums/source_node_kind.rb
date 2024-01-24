# frozen_string_literal: true

# @abstract
class SourceNodeKind < ClassyEnum::Base
end

class SourceNodeKind::Unknown < SourceNodeKind
  dry_type_default!
  dry_type_fallback!
end

class SourceNodeKind::Element < SourceNodeKind
end

class SourceNodeKind::Text < SourceNodeKind
end

class SourceNodeKind::Comment < SourceNodeKind
end
