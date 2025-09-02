require "yaml"
require "set"

base = Rails.root.join("vendor/linguist")
languages_yml = YAML.safe_load_file(base.join("languages.yml"))
popular_set = YAML.safe_load_file(base.join("popular.yml")).map(&:to_s).to_set

def slugify(name)
    name.downcase
        .gsub("++", "plus-plus")
        .gsub("#", "sharp")
        .gsub(/\s+/, "-")
        .gsub(/[^a-z0-9\-]/, "")
end

languages_yml.each do |name, attrs|
    Language.upsert(
        {
            name: name,
            slug: slugify(name),
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
