# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_09_03_180248) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "github_events", force: :cascade do |t|
    t.string "remote_event_id"
    t.string "event_type"
    t.datetime "event_time"
    t.datetime "fetched_at"
    t.integer "actor_remote_id"
    t.integer "repo_remote_id"
    t.string "language_slug"
    t.uuid "language_id"
    t.jsonb "payload"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "github_repos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "repo_id", null: false
    t.string "name", null: false
    t.string "html_url"
    t.text "description"
    t.string "language"
    t.integer "stargazers_count", default: 0, null: false
    t.integer "forks_count", default: 0, null: false
    t.index ["user_id", "repo_id"], name: "index_github_repos_on_user_id_and_repo_id", unique: true
    t.index ["user_id"], name: "index_github_repos_on_user_id"
  end

  create_table "github_tokens", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "github_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "languages", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.string "lang_type", null: false
    t.string "color"
    t.string "tm_scope"
    t.string "ace_mode"
    t.string "extensions", default: [], array: true
    t.string "aliases", default: [], array: true
    t.boolean "popular", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_languages_on_name", unique: true
    t.index ["slug"], name: "index_languages_on_slug", unique: true
  end

  create_table "refresh_tokens", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "token"
    t.datetime "expires_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["token"], name: "index_refresh_tokens_on_token"
    t.index ["user_id"], name: "index_refresh_tokens_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "slug", null: false
    t.string "label", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_tags_on_slug", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "provider", default: "github", null: false
    t.string "uid", null: false
    t.string "username", null: false
    t.string "name"
    t.string "avatar_url", null: false
    t.datetime "last_login_at"
    t.inet "last_login_ip"
    t.string "last_login_user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "github_repos", "users"
  add_foreign_key "github_tokens", "users"
  add_foreign_key "refresh_tokens", "users"
end
