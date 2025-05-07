# frozen_string_literal: true

class ReadingGroupCollectionAuthorizer < ApplicationAuthorizer
  include AbstractCollectionAuthorizer

  def default(adjective, user, options = {})
    resource.reading_group.send(:"#{adjective}_by?", user, options)
  end
end
