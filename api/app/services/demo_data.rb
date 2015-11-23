require "faker"
require "open-uri"

# Loads demo data into the Manifold installation
class DemoData
  def load
    clear_db
    make_projects(10)
  end

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
      p.save
    end
  end

  private

  def clear_db
    Project.destroy_all
    Collaborator.destroy_all
    Maker.destroy_all
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
