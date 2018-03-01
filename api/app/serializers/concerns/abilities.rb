# Includes serializer authorization
module Abilities
  extend ActiveSupport::Concern
  #
  # def abilities_for_user
  #   {
  #     read: read?,
  #     create: create?,
  #     update: update?,
  #     delete: delete?,
  #     update_metadata: update_metadata?,
  #     update_makers: update_makers?,
  #     read_if_deleted: read_if_deleted?,
  #     creator: current_user_is_creator
  #   }
  # end
  #
  # def abilities
  #   {
  #     view_drafts: view_drafts?
  #   }
  # end
  #
  # def class_abilities
  #   {
  #     page: abilities_for(Page),
  #     annotation: abilities_for(Annotation),
  #     comment: abilities_for(Comment),
  #     project: abilities_for(Project),
  #     permission: abilities_for(Permission),
  #     resource: abilities_for(Resource),
  #     settings: abilities_for(Settings),
  #     statistics: abilities_for(Statistics),
  #     subject: abilities_for(Subject),
  #     text: abilities_for(Text),
  #     user: abilities_for(User),
  #     version: abilities_for(Version)
  #   }
  # end
  #
  # def abilities_for(klass)
  #   {
  #     create: klass.creatable_by?(object),
  #     read: klass.readable_by?(object),
  #     update: klass.updatable_by?(object)
  #   }
  # end
  #
  # def user
  #   current_user || Naught.build { |config| config.predicates_return false }.new
  # end
  #
  # def read?
  #   object.readable_by? user
  # end
  # alias can_read_object? read?
  #
  # def create?
  #   object.creatable_by? user
  # end
  # alias can_create_object? create?
  #
  # def update?
  #   object.updatable_by? user
  # end
  # alias can_update_object? update?
  #
  # def delete?
  #   object.deletable_by? user
  # end
  # alias can_delete_object? delete?
  #
  # def read_if_deleted?
  #   object.readable_if_deleted_by? user
  # end
  # alias can_read_deleted? read_if_deleted?
  #
  # def update_metadata?
  #   object.resource_metadata_updatable_by? user
  # end
  # alias can_update_metadata? update_metadata?
  #
  # def update_makers?
  #   object.project_makers_updatable_by? user
  # end
  # alias can_update_makers? update_makers?
  #
  # def view_drafts?
  #   object.can?(:view_drafts)
  # end
  #
  # def current_user_is_creator
  #   return false unless authenticated?
  #   return false unless object.respond_to? :creator_id
  #   current_user.id == object.creator_id
  # end
end
