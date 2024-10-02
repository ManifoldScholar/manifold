# frozen_string_literal: true

RSpec.describe SoftDeletions::PurgeJob, type: :job do
  let_it_be(:project, refind: true) { FactoryBot.create :project }

  context "when a record has been marked for purge" do
    before do
      project.async_destroy
    end

    it "destroys a marked-for-purge record" do
      expect do
        described_class.perform_now project
      end.to change(Project, :count).by(-1)

      expect do
        project.reload
      end.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  context "when a record has not been marked for purge" do
    it "is a no-op" do
      expect do
        described_class.perform_now project
      end.to keep_the_same(Project, :count)

      expect do
        project.reload
      end.to execute_safely
    end
  end
end
