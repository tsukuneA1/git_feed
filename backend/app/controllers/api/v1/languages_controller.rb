class Api::V1::LanguagesController < ApplicationController
  def popular
    render json: {
      items: [
        { slug: "typescript", label: "TypeScript", color: "#3178c6", bytes: 1234, reposCount: 567 },
        { slug: "python", label: "Python", color: "#3572A5", bytes: 2345, reposCount: 890 }
      ],
      total: 2,
      lastUpdated: Time.current.iso8601
    }
  end
end
