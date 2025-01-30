# frozen_string_literal: true

# An abstract interface for models that are specially-managed "properties"
# of a {Project}.
#
# @see ProjectPropertyAuthorizer
# @see RoleName::ProjectPropertyManager
module ProjectProperty
  extend ActiveSupport::Concern
end
