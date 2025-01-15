class CollaboratorRole < ClassyEnum::Base
  def gepub_add_method
    :"add_contributor"
  end
end

class CollaboratorRole::Author < CollaboratorRole
  def gepub_add_method
    :"add_creator"
  end
end
class CollaboratorRole::Editor < CollaboratorRole
end
class CollaboratorRole::EditedBy < CollaboratorRole
end
class CollaboratorRole::Preface < CollaboratorRole
end
class CollaboratorRole::Foreward < CollaboratorRole
end
class CollaboratorRole::Introduction < CollaboratorRole
end
class CollaboratorRole::Afterword < CollaboratorRole
end
class CollaboratorRole::Translator < CollaboratorRole
end
class CollaboratorRole::Illustrator < CollaboratorRole
end
class CollaboratorRole::Photographer < CollaboratorRole
end
class CollaboratorRole::Artist < CollaboratorRole
end
class CollaboratorRole::Contributor < CollaboratorRole
end
class CollaboratorRole::SeriesEditor < CollaboratorRole
end
class CollaboratorRole::EssayBy < CollaboratorRole
end
class CollaboratorRole::RetoldBy < CollaboratorRole
end
class CollaboratorRole::AdaptedBy < CollaboratorRole
end
class CollaboratorRole::CollectedBy < CollaboratorRole
end
class CollaboratorRole::Agent < CollaboratorRole
end
class CollaboratorRole::OtherProprietor < CollaboratorRole
end
class CollaboratorRole::Other < CollaboratorRole
end
