require "yaml"
require "set"

base = Rails.root.join("vendor/linguist")
unless File.exist?(base)
  puts "[seed] ERROR: Directory not found: #{base}"
  exit(1)
end
languages_yml_path = base.join("languages.yml")
unless File.exist?(languages_yml_path)
  puts "[seed] ERROR: File not found: #{languages_yml_path}"
  exit(1)
end
popular_yml_path = base.join("popular.yml")
unless File.exist?(popular_yml_path)
  puts "[seed] ERROR: File not found: #{popular_yml_path}"
  exit(1)
end
languages_yml = YAML.safe_load_file(languages_yml_path)
popular_set = YAML.safe_load_file(popular_yml_path).map(&:to_s).to_set

slugify = ->(name) {
    name.downcase
        .gsub("++", "plus-plus")
        .gsub("#", "sharp")
        .gsub(/\s+/, "-")
        .gsub(/[^a-z0-9\-]/, "")
}
languages_yml.each do |name, attrs|
    Language.upsert(
        {
            name: name,
            slug: slugify.call(name),
            lang_type: attrs["type"].to_s,
            color: attrs["color"],
            tm_scope: attrs["tm_scope"],
            ace_mode: attrs["ace_mode"],
            extensions: Array(attrs["extensions"]).map(&:to_s),
            aliases: Array(attrs["aliases"]).map(&:to_s),
            popular: popular_set.include?(name),
            created_at: Time.current,
            updated_at: Time.current
        },
        unique_by: :slug
    )
end

puts "[seed] languages => #{Language.count} rows (#{Language.where(popular: true).count} popular)"

# Create tags from existing languages
Language.find_each do |language|
  Tag.find_or_create_by!(slug: language.slug) do |tag|
    tag.label = language.name
  end
end

puts "[seed] tags => #{Tag.count} rows"
