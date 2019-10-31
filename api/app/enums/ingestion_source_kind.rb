class IngestionSourceKind < ClassyEnum::Base
end

class IngestionSourceKind::PublicationResource < IngestionSourceKind
end

class IngestionSourceKind::Navigation < IngestionSourceKind
end

class IngestionSourceKind::Section < IngestionSourceKind
end

class IngestionSourceKind::CoverImage < IngestionSourceKind
end
