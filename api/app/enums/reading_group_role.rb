class ReadingGroupRole < ClassyEnum::Base
  def to_role_name
    RoleName.fetch(to_s)
  end
end

class ReadingGroupRole::Moderator < ReadingGroupRole
end

class ReadingGroupRole::Member < ReadingGroupRole
end
