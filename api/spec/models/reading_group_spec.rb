# frozen_string_literal: true

RSpec.describe ReadingGroup, type: :model do
  let_it_be(:creator, refind: true) { FactoryBot.create_default :user }
  let_it_be(:project, refind: true) { FactoryBot.create_default :project, creator: creator }
  let_it_be(:text, refind: true) { FactoryBot.create_default :text, project: project, creator: creator }
  let_it_be(:text_section) { FactoryBot.create_default :text_section, text: text }

  it "has an invitation_code after it's saved" do
    reading_group = FactoryBot.create(:reading_group)

    expect(reading_group).to be_invitation_code
  end

  it "always has an upper case invitation code", :aggregate_failures do
    reading_group = FactoryBot.create(:reading_group, invitation_code: "aaaccc123")

    expect(reading_group.invitation_code).to eq "AAACCC123"
    expect(reading_group.reload.invitation_code).to eq "AAACCC123"
  end

  context "when it is destroyed" do
    let(:public_annotation) { FactoryBot.create(:annotation, :is_public, reading_group: reading_group) }
    let(:private_annotation) { FactoryBot.create(:annotation, :is_private, reading_group: reading_group) }

    context "when it is public" do
      let(:reading_group) { FactoryBot.create(:reading_group, privacy: "public") }
      it "ensures that child annotations are public" do
        expect do
          reading_group.destroy
        end.to change { public_annotation.reload.reading_group }.to(nil)
          .and change { private_annotation.reload.reading_group }.to(nil)
          .and keep_the_same { public_annotation.reload.private }
          .and change { private_annotation.reload.private }.from(true).to(false)
      end
    end

    context "when it is private" do
      let(:reading_group) { FactoryBot.create(:reading_group, privacy: "private") }
      it "ensures that child annotations are private" do
        expect do
          reading_group.destroy
        end.to change { public_annotation.reload.reading_group }.to(nil)
          .and change { private_annotation.reload.reading_group }.to(nil)
          .and change { public_annotation.reload.private }.from(false).to(true)
          .and keep_the_same { private_annotation.reload.private }
      end
    end

    context "when it is anonymous" do
      let(:reading_group) { FactoryBot.create(:reading_group, privacy: "anonymous") }
      it "ensures that child annotations are private" do
        expect do
          reading_group.destroy
        end.to change { public_annotation.reload.reading_group }.to(nil)
          .and change { private_annotation.reload.reading_group }.to(nil)
          .and change { public_annotation.reload.private }.from(false).to(true)
          .and keep_the_same { private_annotation.reload.private }
      end
    end
  end

  context "when detecting spam" do
    context "with a non-public reading group" do
      before do
        akismet_enabled!

        akismet_stub_comment_check!(situation: :spam)
      end

      let(:instance) { FactoryBot.build :reading_group, :is_private }

      subject { instance }

      it { is_expected.not_to have_an_error_of_type(:spam) }
    end

    context "with a public reading group" do
      it_behaves_like "a model with spam detection" do
        let(:instance) { FactoryBot.build :reading_group, :is_public }
      end
    end
  end
end
