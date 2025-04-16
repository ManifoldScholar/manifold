class CollaboratorRole < ClassyEnum::Base
  config.priority = 1_000_000 # default at the bottom

  config_accessor :priority, instance_writer: false

  def gepub_add_method
    :add_contributor
  end
end

class CollaboratorRole::Author < CollaboratorRole
  config.priority = 1000

  def gepub_add_method
    :add_creator
  end
end

class CollaboratorRole::Editor < CollaboratorRole
  config.priority = 2000
end

class CollaboratorRole::EditedBy < CollaboratorRole
  config.priority = 3000
end

class CollaboratorRole::Preface < CollaboratorRole
  config.priority = 4000
end

class CollaboratorRole::Foreward < CollaboratorRole
  config.priority = 5000
end

class CollaboratorRole::Introduction < CollaboratorRole
  config.priority = 6000
end

class CollaboratorRole::Afterword < CollaboratorRole
  config.priority = 7000
end

class CollaboratorRole::Translator < CollaboratorRole
  config.priority = 8000
end

class CollaboratorRole::Illustrator < CollaboratorRole
  config.priority = 9000
end

class CollaboratorRole::Photographer < CollaboratorRole
  config.priority = 10_000
end

class CollaboratorRole::Artist < CollaboratorRole
  config.priority = 11_000
end

class CollaboratorRole::Contributor < CollaboratorRole
  config.priority = 12_000
end

class CollaboratorRole::SeriesEditor < CollaboratorRole
  config.priority = 13_000
end

class CollaboratorRole::EssayBy < CollaboratorRole
  config.priority = 14_000
end

class CollaboratorRole::RetoldBy < CollaboratorRole
  config.priority = 15_000
end

class CollaboratorRole::AdaptedBy < CollaboratorRole
  config.priority = 16_000
end

class CollaboratorRole::CollectedBy < CollaboratorRole
  config.priority = 17_000
end

class CollaboratorRole::Agent < CollaboratorRole
  config.priority = 18_000
end

class CollaboratorRole::OtherProprietor < CollaboratorRole
  config.priority = 19_000
end

class CollaboratorRole::Other < CollaboratorRole
end
