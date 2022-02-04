module V1
  class JournalVolumeSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :number, Types::Integer
    typed_attribute :journal_issues_count, Types::Integer
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
    typed_has_many :journal_issues, record_type: "journalIssue"
    typed_attribute :slug, Types::String.meta(read_only: true)

    when_full do
      typed_belongs_to :journal
      typed_attribute :pending_slug, Types::String
    end
  end
end
