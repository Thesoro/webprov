#function to get the Bearer Token from twitter. Should be run in terminal; will print json that includes the
#    bearer token (usually starts with "AAAAAAA")
import urllib
import base64
import httplib
import json
import StringIO
import gzip
import secret

CONSUMER_KEY = secret.twitkey
CONSUMER_SECRET = secret.twitsecret

encoded_CONSUMER_KEY = urllib.quote(CONSUMER_KEY)
encoded_CONSUMER_SECRET = urllib.quote(CONSUMER_SECRET)

concat_consumer_url = encoded_CONSUMER_KEY + ":" + encoded_CONSUMER_SECRET

host = 'api.twitter.com'
url = '/oauth2/token/'
params = urllib.urlencode({'grant_type' : 'client_credentials'})
req = httplib.HTTPSConnection(host)
req.putrequest("POST", url)
req.putheader("Host", host)
req.putheader("User-Agent", "My Twitter 1.1")
req.putheader("Authorization", "Basic %s" % base64.b64encode(concat_consumer_url))
req.putheader("Content-Type" ,"application/x-www-form-urlencoded;charset=UTF-8")
req.putheader("Content-Length", "29")
req.putheader("Accept-Encoding", "gzip")

req.endheaders()
req.send(params)

resp = req.getresponse()
print resp.status, resp.reason
a = resp.read()
buf = StringIO.StringIO(a)
gzip_f = gzip.GzipFile(fileobj=buf)
content = gzip_f.read()
print (content)

