module V1
  class JournalVolumeSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :number, Types::Integer
    typed_attribute :journal_issues_count, Types::Integer
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
    typed_attribute :slug, Types::String.meta(read_only: true)

    typed_has_many :journal_issues, record_type: "journalIssue" do |object, params|
      object.journal_issues.with_read_ability(params[:current_user])
    end

    when_full do
      typed_belongs_to :journal
      typed_attribute :pending_slug, Types::String
    end
  end
end
