class Message
  include Mongoid::Document
  include Mongoid::Timestamps

  field :from, :type => BSON::ObjectId
  field :to, :type => BSON::ObjectId
  field :viewed, :type => Boolean, :default => false

  field :from_name
  field :to_name

  field :content
  field :subject

end
