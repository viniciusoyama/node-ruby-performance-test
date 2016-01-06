Mongoid.configure do |config|
  config.sessions = {
                      :default => {
                                    :hosts => ["localhost:27017"], :database => "performance_test"
                                  }
                    }

end

Mongoid.logger.level = Logger::INFO
Mongo::Logger.logger.level = Logger::INFO

class Bear
  include Mongoid::Document

  field :name, type: String
end

class App < Sinatra::Base
  get '/' do
    content_type :json
    { message: 'hooray! welcome to our api!' }.to_json
  end

  # list all
  get '/api/bears' do
    content_type :json
    Bear.all.to_json
  end

  # create
  post '/api/bears' do
    content_type :json
    halt 500 unless Bear.create({ name: params['name'] })
    { message: 'Bear created!' }.to_json
  end
end
