# Includes serializer authorization
module Abilities
  extend ActiveSupport::Concern

  def abilities
    {
      read: read?,
      create: create?,
      update: update?,
      delete: delete?,
      read_if_deleted: read_if_deleted?,
      creator: current_user_is_creator
    }
  end

  def class_abilities
    {
      comment: abilities_for(Comment),
      annotation: abilities_for(Annotation),
      user: abilities_for(User)
    }
  end

  def abilities_for(klass)
    { create: klass.creatable_by?(object), read: klass.readable_by?(object) }
  end

  def user
    current_user || Naught.build { |config| config.predicates_return false }.new
  end

  def read?
    object.readable_by? user
  end
  alias can_read_object? read?

  def create?
    object.creatable_by? user
  end
  alias can_create_object? create?

  def update?
    object.updatable_by? user
  end
  alias can_update_object? update?

  def delete?
    object.deletable_by? user
  end
  alias can_delete_object? delete?

  def read_if_deleted?
    object.readable_if_deleted_by? user
  end
  alias can_read_deleted? read_if_deleted?

  def current_user_is_creator
    return false unless authenticated?
    return false unless object.respond_to? :creator_id
    current_user.id == object.creator_id
  end
end
