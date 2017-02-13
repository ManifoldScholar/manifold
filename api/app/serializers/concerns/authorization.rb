# Includes serializer authorization
module Authorization
  extend ActiveSupport::Concern

  def can_update_object?
    scope.try(:authenticated_as).try(:can_update?, object)
  end
end
