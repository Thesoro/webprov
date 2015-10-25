import requests
import json
import random
import secret

bearer = secret.bearer

url = 'https://api.twitter.com/1.1/statuses/user_timeline.json?count=200&screen_name=cher&exclude_replies=false&include_rts=false'
headers = {'Authorization':'Bearer '+ bearer}

r = requests.get(url, headers=headers)
x = json.loads(r.text)
n = random.randint(0,len(x)-1)
t = x[n]['text']
while ('http://' in t or 'https://' in t) and " " not in t:
   t = x[random.randint(0,len(x)-1)]['text']
   print "nope!"
print t

