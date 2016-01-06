ab -n 8000 -c 80  -T "multipart/form-data;" -p postabachebench.txt 'http://127.0.0.1:9292/api/bears'
ab -n 8000 -c 80 'http://127.0.0.1:9292/api/bears'

RACK_ENV=production puma -t 8:32 -w 4
RACK_ENV=production bundle exec unicorn -c unicorn.rb  -p 9292
