AnonymousUser = Naught.build do |config|
  config.impersonate User
  config.predicates_return false

  def role
    nil
  end

  def kind
    nil
  end

  def can_read?(resource, *other)
    resource.readable_by? self, *other
  end
end
