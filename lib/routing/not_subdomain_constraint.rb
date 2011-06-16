class Routing::NotSubdomainConstraint
  def self.matches?(request)
    request.subdomain.blank?
  end
end