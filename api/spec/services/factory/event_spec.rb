require "rails_helper"

RSpec.describe Factory::Event do

  let(:factory) { Factory::Event.new }

  it "resolves a subject keyword argument to an event subject" do
    project = FactoryBot.create(:project)
    event = factory.create(EventType[:project_created], subject: project)
    expect(event.subject_id).to eq(project.id)
    expect(event.subject_type).to eq("Project")
    expect(event.subject).to eq(project)
  end

  it "resolves subject_type and subject_id keyword arguments to an event subject" do
    project = FactoryBot.create(:project)
    event = factory.create(
      EventType[:project_created],
      subject_type: "Project",
      subject_id: project.id
    )
    expect(event.subject_id).to eq(project.id)
    expect(event.subject_type).to eq("Project")
    expect(event.subject).to eq(project)
  end

  it "raises an exception when it's not given a subject" do
    expect{factory.create(EventType[:project_created])}
      .to raise_error(Factory::Errors::NoEventSubject)
  end

  it "creates a valid event" do
    project = FactoryBot.create(:project)
    event = factory.create(EventType[:project_created], subject: project)
    match = I18n.t("services.factory.event.event_title.project_created")
    expect(event).to be_valid
  end

  it "assigns the event_title from the localized string" do
    project = FactoryBot.create(:project)
    event = factory.create(EventType[:project_created], subject: project)
    match = I18n.t("services.factory.event.event_title.project_created")
    expect(event.event_title).to eq match
  end

  it "assigns the event_subtitle from the localized string" do
    project = FactoryBot.create(:project)
    event = factory.create(EventType[:project_created], subject: project)
    match = I18n.t(
      "services.factory.event.event_subtitle.project_created",
      global_installation_name: "Manifold"
    )
    expect(event.event_subtitle).to eq match
  end

  it "assigns the subject title to the event" do
    project = FactoryBot.create(:project, title: "a title")
    event = factory.create(EventType[:project_created], subject: project)
    expect(event.subject_title).to eq project.title
  end

  it "assigns the subject subtitle to the event" do
    project = FactoryBot.create(:project, subtitle: "a subtitle")
    event = factory.create(EventType[:project_created], subject: project)
    expect(event.subject_subtitle).to eq project.subtitle
  end

  it "assigns the project from the subject for project_created event" do
    project = FactoryBot.create(:project, subtitle: "a subtitle")
    event = factory.create(EventType[:project_created], subject: project)
    expect(event.project).to eq project
  end

  it "assigns the project from the subject for TEXT_ADDED event" do
    text = FactoryBot.create(:text)
    event = factory.create(EventType[:text_added], subject: text)
    expect(event.project).to eq text.project
  end

  it "raises an exception if the subject can't be resolved to a project" do
    user = FactoryBot.create(:user)
    expect{
      factory.create(EventType[:text_added], subject: user)
    }.to raise_error(Factory::Errors::NoEventProject)
  end

  it "correctly reports whether an i18n key is set" do
    t1 = factory.send(:i18n_set?, "services.factory.event.event_title.project_created")
    expect(t1).to eq true
    t2 = factory.send(:i18n_set?, "not.a.real.translation")
    expect(t2).to eq false
  end

  it "correctly records the attribution_name from the subject creator" do
    user = FactoryBot.create(:user, first_name: "Alexander", last_name: "Hamilton")
    annotation = FactoryBot.create(:annotation, creator: user)
    event = factory.create(EventType[:text_annotated], subject: annotation)
    expect(event.attribution_name).to eq "Alexander Hamilton"
  end

end
