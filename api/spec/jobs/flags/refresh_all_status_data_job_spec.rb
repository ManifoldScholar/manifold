# frozen_string_literal: true

RSpec.describe Flags::RefreshAllStatusDataJob, type: :job do
  let_it_be(:annotation, refind: true) { FactoryBot.create :annotation }
  let_it_be(:unresolved_flag, refind: true) { FactoryBot.create :flag, flaggable: annotation }
  let_it_be(:resolved_flag, refind: true) { FactoryBot.create :flag, :resolved, flaggable: annotation }
  let_it_be(:self_resolved_flag, refind: true) { FactoryBot.create :flag, :self_resolved, flaggable: annotation }

  let_it_be(:flagger_ids) do
    [unresolved_flag.creator_id, resolved_flag.creator_id].sort
  end

  before do
    annotation.update_columns(FlagStatus::EMPTY_DATA)
  end

  it "runs as expected" do
    expect do
      described_class.perform_now
    end.to change { annotation.reload.flags_count }.by(3)
      .and change { annotation.reload.resolved_flags_count }.by(2)
      .and change { annotation.reload.unresolved_flags_count }.by(1)
      .and change { annotation.reload.flagger_ids.sort }.from([]).to(flagger_ids)
  end
end
