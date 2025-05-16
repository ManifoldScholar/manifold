class TextTrackKind < ClassyEnum::Base
end

class TextTrackKind::Subtitles < TextTrackKind
end

class TextTrackKind::Captions < TextTrackKind
end

class TextTrackKind::Chapters < TextTrackKind
end

class TextTrackKind::Metadata < TextTrackKind
end
