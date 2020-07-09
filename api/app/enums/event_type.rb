class EventType < ClassyEnum::Base
end
class EventType::ProjectCreated < EventType
end

class EventType::ResourceAdded < EventType
end

class EventType::TextAdded < EventType
end

class EventType::TextAnnotated < EventType
end

class EventType::Tweet < EventType
end

class EventType::CommentCreated < EventType
end

class EventType::ResourceCollectionAdded < EventType
end
