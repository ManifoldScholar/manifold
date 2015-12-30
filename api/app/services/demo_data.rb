require "faker"
require "open-uri"

# Loads demo data into the Manifold installation
class DemoData
  def initialize
    @logger = Logger.new(STDOUT)
  end

  def load
    clear_db
    make_projects(10)
    batch_ingest
    assign_texts_to_projects
    create_admin_user
  end

  def create_admin_user
    u = User.find_or_create_by(email: "admin@manifold.dev")
    u.role = "reader"
    u.password = "manifold"
    u.password_confirmation = "manifold"
    u.save
  end

  def assign_texts_to_projects
    Text.all.each do |text|
      project = Project.limit(1).order("RANDOM()").first
      category = project.text_categories.limit(1).order("RANDOM()").first
      text.project = project
      text.category = category
      text.save
    end
  end

  def batch_ingest
    path = Rails.root.join("..", "texts")
    epubs = Dir.entries(path)
    epubs.reject { |name| name.start_with?(".") }.each do |name|
      epub_path = path.join(name)
      ingest(epub_path)
    end
  end

  def ingest(path)
    Ingestor.logger = @logger
    Ingestor.ingest(path)
    Ingestor.reset_logger
  end

  # rubocop:disable Metrics/AbcSize
  def make_projects(count)
    count.times do
      p = Project.create(title: Faker::Book.title,
                         description: Faker::Hipster.paragraph,
                         cover: File.open(random_cover_image),
                         featured: [true, false].sample
                        )
      p.collaborators.create(
        maker: Maker.create(name: Faker::Book.author),
        role: :creator
      )
      @logger.info("Creating project: #{p.title}".green)
      p.text_categories = random_categories(rand(0..5), Category::ROLE_TEXT)
      p.save
    end
  end

  private

  def clear_db
    clear = %w(Project Collaborator Maker Text TextSection IngestionSource Resource
               Subject TextSubject TextTitle User Category)
    clear.each do |model_name|
      @logger.info("Truncate #{model_name} table".red)
      model_name.constantize.destroy_all
    end
  end

  def random_categories(count, role)
    categories = []
    count.times do |i|
      title = "#{Faker::Hacker.adjective.titlecase} Category ##{i + 1}"
      categories.push Category.create(title: title, role: role)
      @logger.info("  Creating category: #{title}".light_yellow)
    end
    categories
  end

  def random_cover_image
    w, h = random_cover_ratio
    url_params = "txtsize=19&bg=000000&txt=#{w}%C3%97#{h}&w=#{w}&h=#{h}&fm=png"
    url = "https://placeholdit.imgix.net/~text?#{url_params}"
    path = "/tmp/#{Faker::Lorem.characters(10)}.png"
    File.open(path, "wb") do |f|
      f.binmode
      f.write HTTParty.get(url).parsed_response
    end
    path
  end

  def random_cover_ratio
    ratios = [[5, 8], [6, 9], [8, 10], [7, 7], [10, 8], [13, 11]]
    ratio = ratios.sample
    h = 200
    w = ((ratio[0].to_f / ratio[1].to_f) * h).round
    [w, h]
  end
end
