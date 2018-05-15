require "nokogiri"
require "HTTParty"
require "fileutils"
require "uri"
require "json"


pages = 10

def parse_page_num(page_num)
  rest
  url = "https://standardebooks.org/ebooks/?page=#{page_num}"
  parse_url(url)
end

def parse_url(url)
  puts "fetching #{url}"
  source = HTTParty.get(url)
  Nokogiri::HTML(source)
end

def path_to_url(path)
  return "https://standardebooks.org#{path}"
end

def urls(parsed)
  paths = parsed.at_css("ol").css("p a").map { |node| node.attribute("href").value }
  paths.map { |p| path_to_url(p) }
end

def fetch_epub(book_page_parsed)
  epub3_link_node = book_page_parsed.css(".epub").find { |node| node.attribute("href").value.end_with?("epub3")}
  epub_url = path_to_url(epub3_link_node.attribute("href"))
  puts "found epub at #{epub_url}"
  uri = URI.parse(epub_url)
  file_name = File.basename(uri.path)
  dir_name = file_name.gsub(".epub3", "")
  FileUtils.mkdir_p("import/#{dir_name}/texts")
  path = "import/#{dir_name}/texts/#{file_name}".gsub(".epub3", ".epub")
  unless File.file?(path)
    File.open(path, "wb") do |f|
      f.write HTTParty.get(epub_url).body
    end
  end
  [dir_name, File.basename(path)]
end

def make_project_json(book_page_parsed, dir_name, epub_file_name, hero, cover)
  p = book_page_parsed
  obj = {
    attributes: {
      title: p.at_css("h1").inner_text,
      description: p.at_css("#description p").inner_text,
      metadata: {
      }
    },
    avatar: cover,
    cover: cover,
    hero: hero,
    published_text: epub_file_name,
    relationships: {
      makers: [
        {
          attributes: {
            name: p.at_css("article.ebook > header > div > p").inner_text,
            role: "creator"
          }
        }
      ]
    }

  }
  json_path = "import/#{dir_name}/project.json"
  File.open(json_path,"w") do |f|
    f.write(JSON.pretty_generate(obj))
  end
end

def fetch_images(book_page_parsed, dir_name)
  p = book_page_parsed
  hero_href = p.at_css("article.ebook > header > img").attribute("src").value
  hero_uri = URI.parse(path_to_url(hero_href))
  hero_file_name = File.basename(hero_uri.path)
  hero_ext = File.extname(hero_uri.path)
  hero_path = "import/#{dir_name}/hero#{hero_ext}"
  unless File.file?(hero_path)
    File.open(hero_path, "wb") do |f|
      f.write HTTParty.get(hero_uri).body
    end
  end
  cover_href = hero_href.gsub("-hero", "-thumbnail")
  cover_uri = URI.parse(path_to_url(cover_href))
  cover_file_name = File.basename(cover_uri.path)
  cover_ext = File.extname(cover_uri.path)
  cover_path = "import/#{dir_name}/cover#{cover_ext}"
  unless File.file?(cover_path)
    File.open(cover_path, "wb") do |f|
      f.write HTTParty.get(cover_uri).body
    end
  end
  return ["hero#{hero_ext}", "cover#{cover_ext}"]
end

def download(page_num)
  ensure_dir
  book_page_urls = urls(parse_page_num(page_num))
  book_page_urls.each do | book_page_url |
    book_page_parsed = parse_url(book_page_url)
    dir_name, epub_file_name = fetch_epub(book_page_parsed)
    hero, cover = fetch_images(book_page_parsed, dir_name)
    make_project_json(book_page_parsed, dir_name, epub_file_name, hero, cover)
  end
end

def ensure_dir
  FileUtils.mkdir_p("import")
end

def rest
  sleep 1
end

10.times do |i|
  download(i)
end
