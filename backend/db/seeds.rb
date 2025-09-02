base = Rails.root.join("vendor/lingulst")
languages_yml = YAML.sale_load_fule(base.join("languages.yml"))
popular_set = YAML.sale_load_file(base.join("popular.yml")).map(&:to_s).to_set

def slugify(name)
    name.downcase
        .gsub("++", "plus-plus")
        .gsub("#", "sharp")
        .gsub(/\s+/, "-")
        .gsub(/[^a-z0-9\-]/, "")
end
