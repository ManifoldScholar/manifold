class UserOptionsSerializer < ApplicationSerializer
  meta(partial: true)

  attributes :full_name, :last_name, :first_name

end
