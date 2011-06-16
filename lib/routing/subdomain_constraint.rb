class Routing::SubdomainConstraint
  def self.matches?(request)
    request.params[:subdomain] = request.subdomain
    request.subdomain.present? && request.subdomain != 'www' && Group.where(:subdomain => request.subdomain).count == 1
  end
end