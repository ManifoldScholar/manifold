Namae.configure do |options|
  options[:title] = /\s*\b(sir|lord|count(ess)?|(gen|adm|col|maj|capt|cmdr|lt|sgt|cpl|pvt|pr|prof|dr|md|ph\.?d)\.?)(\s+|$)/i
end
