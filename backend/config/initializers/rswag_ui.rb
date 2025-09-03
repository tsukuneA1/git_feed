Rswag::Ui.configure do |c|
  # List the Swagger endpoints that you want to be documented through the
  # ...
  c.swagger_endpoint "/api-docs/v1/openapi.yaml", Rails.root.join("..", "schema", "openapi.yaml").to_s

  # Add Basic Auth in case your API is private
  # c.basic_auth_enabled = true
  # c.basic_auth_credentials "username", "password"
end
