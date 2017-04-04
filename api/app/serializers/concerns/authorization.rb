# Includes serializer authorization
module Authorization
  extend ActiveSupport::Concern

  def can_update_object?
    scope.try(:authenticated_as).try(:can_update?, object)
  end
  alias can_update_object can_update_object?

  def can_delete_object?
    scope.try(:authenticated_as).try(:can_delete?, object)
  end
  alias can_delete_object can_delete_object?
end
