FactoryBot.define do
  factory :favorite do
    initialize_with do
      collectable_associations = Collections::Mapping[User][favoritable].associations

      entry_factory = collectable_associations.entry.singular

      favoritable_key = collectable_associations.collectable.singular

      attrs = { user: user, favoritable_key => favoritable, created_at: created_at, updated_at: updated_at }

      entry = create(entry_factory, attrs)

      entry.favorite
    end

    skip_create

    association(:favoritable, factory: :project)
    association(:user)

    created_at { Time.current }
    updated_at { created_at }
  end
end
