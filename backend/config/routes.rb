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
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
