# frozen_string_literal: true

module EntitlementImports
  class GenerateFake
    include Dry::Monads[:result, :do]

    HEADERS = %w[email subject expires_on].freeze

    def call
      content = yield generate_csv

      path = yield generate_path

      yield write_csv! path, content

      Success path
    end

    private

    def generate_csv
      emails = yield find_emails

      subject = yield cycle_subjects

      content = CSV.generate do |csv|
        csv << HEADERS

        emails.each do |email|
          csv << [email, subject.next, "2023-12-31"]
        end
      end

      Success content
    end

    def generate_path
      filename = Zaru.sanitize! "import-#{Time.current.iso8601}.csv"

      Success Rails.root.join("tmp", filename)
    end

    def find_emails
      emails = User.where(classification: "default").order(Arel.sql("RANDOM()")).limit(10).pluck(:email)

      emails << "does.not.exist+#{rand(10..100)}@example.org"

      Success emails
    end

    def cycle_subjects
      proj = Project.order(Arel.sql("RANDOM()")).sample&.to_entitlement_gid&.to_s

      coll = ProjectCollection.order(Arel.sql("RANDOM()")).sample&.to_entitlement_gid&.to_s

      Success [proj, coll, "subscriber"].compact.cycle
    end

    def write_csv!(path, content)
      path.open("wb+") do |f|
        f.write content
      end

      puts "Wrote testing entitlement import at #{path}" unless Rails.env.test?

      Success()
    end
  end
end
