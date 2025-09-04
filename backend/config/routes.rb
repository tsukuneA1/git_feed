Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # OAuth routes (outside of API scope for omniauth compatibility)
  get "/auth/github", to: "auth#github"
  get "/auth/github/callback", to: "auth#callback"
  get "/auth/failure", to: "auth#failure"

  # API routes
  scope "/api/v1" do
    post "/auth/refresh", to: "auth#refresh"
    post "/auth/logout", to: "auth#logout"
    get "/me", to: "users#me"
    get "/feed", to: "feed#show"
    get  "/languages/popular", to: "languages#popular"
    post "/user_tag_prefs", to: "api/v1/user_tag_prefs#create"
  end

  # Root route for render.com deployment
  root to: proc {
    body = { status: "ok", service: "api", sha: ENV.fetch("RENDER_GIT_COMMIT", "unknown")[0, 7] }.to_json
    [ 200, { "Content-Type" => "application/json" }, [ body ] ]
  }
end
