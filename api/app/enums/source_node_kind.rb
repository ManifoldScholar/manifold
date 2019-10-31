class SourceNodeKind < ClassyEnum::Base
end

class SourceNodeKind::Element < SourceNodeKind
end

class SourceNodeKind::Text < SourceNodeKind
end

class SourceNodeKind::Comment < SourceNodeKind
end
