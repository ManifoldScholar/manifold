module Analytics
  module Project
    class Response < Types::FlexibleStruct
      extend ActiveModel::Naming
      # include ActiveModel::Validations
      # include ActiveModel::Conversion
      include Authority::Abilities
      # include Concerns::SerializedAbilitiesFor
      # include Redis::Objects

      self.authorizer_name = "ProjectChildAuthorizer"

      delegate :id, to: :project

      attribute :project, Types.Instance(Project)
      attribute :day, Types::Nominal::DateTime
      attribute :project_views, Types::Nominal::Integer
      attribute :resource_views, Types::Nominal::Integer
      attribute :resource_collection_views, Types::Nominal::Integer
      attribute :text_views, Types::Nominal::Integer
      attribute :texet_section_views, Types::Nominal::Integer

    end
  end
end
