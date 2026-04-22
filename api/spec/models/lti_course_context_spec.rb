# frozen_string_literal: true

require "rails_helper"

RSpec.describe LtiCourseContext, type: :model do
  describe "associations" do
    it "belongs to lti_deployment" do
      expect(described_class.reflect_on_association(:lti_deployment).macro).to eq(:belongs_to)
    end

    it "belongs to reading_group (optional)" do
      assoc = described_class.reflect_on_association(:reading_group)
      expect(assoc.macro).to eq(:belongs_to)
      expect(assoc.options[:optional]).to be true
    end
  end

  describe "validations" do
    it "is valid with a factory-built record" do
      expect(FactoryBot.build(:lti_course_context)).to be_valid
    end

    it "is invalid without a context_id" do
      expect(FactoryBot.build(:lti_course_context, context_id: nil)).not_to be_valid
    end

    it "enforces uniqueness of context_id scoped to lti_deployment" do
      existing = FactoryBot.create(:lti_course_context)
      duplicate = FactoryBot.build(:lti_course_context,
                                   lti_deployment: existing.lti_deployment,
                                   context_id: existing.context_id)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:context_id]).to be_present
    end

    it "allows the same context_id across different deployments" do
      FactoryBot.create(:lti_course_context, context_id: "ctx-shared")
      second = FactoryBot.build(:lti_course_context, context_id: "ctx-shared")
      expect(second).to be_valid
    end
  end

  describe "DB-level constraints" do
    it "rejects duplicate (lti_deployment_id, context_id) at the DB layer" do
      existing = FactoryBot.create(:lti_course_context)
      expect do
        described_class.connection.execute(<<~SQL)
          INSERT INTO lti_course_contexts (id, lti_deployment_id, context_id, created_at, updated_at)
          VALUES ('#{SecureRandom.uuid}', '#{existing.lti_deployment_id}', '#{existing.context_id}', NOW(), NOW())
        SQL
      end.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end

  describe "cascade behavior" do
    it "is destroyed when its LtiDeployment is destroyed" do
      lcc = FactoryBot.create(:lti_course_context)
      expect { lcc.lti_deployment.destroy! }
        .to change { described_class.exists?(lcc.id) }.from(true).to(false)
    end

    it "survives ReadingGroup destruction with reading_group_id nilled" do
      lcc = FactoryBot.create(:lti_course_context, :linked_to_reading_group)
      rg  = lcc.reading_group
      expect { rg.destroy! }
        .not_to change { described_class.exists?(lcc.id) }
      expect(lcc.reload.reading_group_id).to be_nil
    end
  end
end
