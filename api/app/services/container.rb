class Container
  include IntrospectiveContainer

  merge Entitlements::Container, namespace: "entitlements"

  register_simple_callables_in :roles, :add, :remove
end
