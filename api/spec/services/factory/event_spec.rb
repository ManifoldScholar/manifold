require "rails_helper"

RSpec.describe Factory::Event do

  let(:factory) { Factory::Event.new }

  it "resolves a subject keyword argument to an event subject" do
    project = FactoryGirl.create(:project)
    event = factory.create(Event::PROJECT_CREATED, subject: project)
    expect(event.subject_id).to eq(project.id)
    expect(event.subject_type).to eq("Project")
    expect(event.subject).to eq(project)
  end

  it "resolves subject_type and subject_id keyword arguments to an event subject" do
    project = FactoryGirl.create(:project)
    event = factory.create(
      Event::PROJECT_CREATED,
      subject_type: "Project",
      subject_id: project.id
    )
    expect(event.subject_id).to eq(project.id)
    expect(event.subject_type).to eq("Project")
    expect(event.subject).to eq(project)
  end

  it "raises an exception when it's not given a subject" do
    expect{factory.create(Event::PROJECT_CREATED)}
      .to raise_error(Factory::Errors::NoEventSubject)
  end

  it "creates a valid event" do
    project = FactoryGirl.create(:project)
    event = factory.create(Event::PROJECT_CREATED, subject: project)
    match = I18n.t("services.factory.event.event_title.project_created")
    expect(event).to be_valid
  end

  it "assigns the event_title from the localized string" do
    project = FactoryGirl.create(:project)
    event = factory.create(Event::PROJECT_CREATED, subject: project)
    match = I18n.t("services.factory.event.event_title.project_created")
    expect(event.event_title).to eq match
  end

  it "assigns the event_subtitle from the localized string" do
    project = FactoryGirl.create(:project)
    event = factory.create(Event::PROJECT_CREATED, subject: project)
    match = I18n.t("services.factory.event.event_subtitle.project_created")
    expect(event.event_subtitle).to eq match
  end

  it "assigns the subject title to the event" do
    project = FactoryGirl.create(:project, title: "a title")
    event = factory.create(Event::PROJECT_CREATED, subject: project)
    expect(event.subject_title).to eq project.title
  end

  it "assigns the subject subtitle to the event" do
    project = FactoryGirl.create(:project, subtitle: "a subtitle")
    event = factory.create(Event::PROJECT_CREATED, subject: project)
    expect(event.subject_subtitle).to eq project.subtitle
  end

  it "assigns the project from the subject for project_created event" do
    project = FactoryGirl.create(:project, subtitle: "a subtitle")
    event = factory.create(Event::PROJECT_CREATED, subject: project)
    expect(event.project).to eq project
  end

  it "assigns the project from the subject for TEXT_ADDED event" do
    text = FactoryGirl.create(:text)
    event = factory.create(Event::TEXT_ADDED, subject: text)
    expect(event.project).to eq text.project
  end

  it "raises an exception if the subject can't be resolved to a project" do
    user = FactoryGirl.create(:user)
    expect{
      factory.create(Event::TEXT_ADDED, subject: user)
    }.to raise_error(Factory::Errors::NoEventProject)
  end

  it "correctly reports whether an i18n key is set" do
    t1 = factory.send(:i18n_set?, "services.factory.event.event_title.project_created")
    expect(t1).to eq true
    t2 = factory.send(:i18n_set?, "not.a.real.translation")
    expect(t2).to eq false
  end

  it "correctly records the attribution_name from the subject creator" do
    user = FactoryGirl.create(:user, first_name: "Alexander", last_name: "Hamilton")
    puts user.id
    annotation = FactoryGirl.create(:annotation, creator: user)
    event = factory.create(Event::TEXT_ANNOTATED, subject: annotation)
    expect(event.attribution_name).to eq "Alexander Hamilton"
  end

end
