# frozen_string_literal: true

module EntitlementImports
  class GenerateFake
    include Dry::Monads[:result, :do]

    HEADERS = %w[email subject expiration first_name last_name].freeze

    EXPIRATIONS = [
      "in 1 year",
      "in 2 months",
      "6 weeks from now"
    ].freeze

    def call
      content = yield generate_csv

      path = yield generate_path

      yield write_csv! path, content

      Success path
    end

    private

    def generate_csv
      details = yield find_details

      subject = yield cycle_subjects

      expirations = EXPIRATIONS.cycle

      content = CSV.generate do |csv|
        csv << HEADERS

        details.each do |(email, first_name, last_name)|
          csv << [email, subject.next, expirations.next, first_name, last_name]
        end
      end

      Success content
    end

    def generate_path
      filename = Zaru.sanitize! "import-#{Time.current.iso8601}.csv"

      Success Rails.root.join("tmp", filename)
    end

    def find_details
      details = User.where(classification: "default").order(Arel.sql("RANDOM()")).limit(10).pluck(:email, :first_name, :last_name)

      remainder = 20 - details.size

      remainder.times do |i|
        details << ["does.not.exist+#{i}@example.org", "Unknown+#{i}", "User"]
      end

      Success details
    end

    def cycle_subjects
      proj = Project.order(Arel.sql("RANDOM()")).sample&.to_entitlement_gid&.to_s

      coll = ProjectCollection.order(Arel.sql("RANDOM()")).sample&.to_entitlement_gid&.to_s

      jrn = Journal.order(Arel.sql("RANDOM()")).sample&.to_entitlement_gid&.to_s

      Success [proj, coll, jrn, "subscriber"].compact.cycle
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
