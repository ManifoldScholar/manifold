class AhoyEventType < ClassyEnum::Base
end

# rubocop:disable Style/ClassAndModuleChildren
class AhoyEventType::View < AhoyEventType
end

class AhoyEventType::SearchResult < AhoyEventType
end

# rubocop:enable Style/ClassAndModuleChildren
