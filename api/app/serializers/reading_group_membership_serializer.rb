class ReadingGroupMembershipSerializer < ApplicationSerializer

  meta(partial: false)

  attributes :id, :annotations_count, :highlights_count
  has_one :user, serializer: UserSerializer

end
