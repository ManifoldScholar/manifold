class Container
  include IntrospectiveContainer

  register_simple_callables_in :roles, :add, :remove
end
