class CollaboratorRole < ClassyEnum::Base
  def gepub_add_method
    :"add_#{self}"
  end
end

class CollaboratorRole::Creator < CollaboratorRole
end

class CollaboratorRole::Contributor < CollaboratorRole
end
