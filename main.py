import logging
import os
# Our basic MVC frameworks for the backend
import webapp2

# Encode urls
from base64 import b64encode, b64decode
# Generate random hashes for session id
import random
import xmltodict
import json


# The general host, with most routing deferred to AngularJS on the client side
class MainPage(webapp2.RequestHandler):

  def get(self):

    # Serve the index
    indexurl = "index.html"

    f = open(indexurl)

    self.response.status = 200
    self.response.write( f.read() )


# this function returns game data
class GameList(webapp2.RequestHandler):
  def get(self, name):
    x = open('iprov.xml')
    data = x.read()
    d = xmltodict.parse(data)
    c = json.dumps(d['dataroot']['item'])

    self.response.status = 200
    self.response.write(c)

application = webapp2.WSGIApplication( [
  ("/game/(.*)", GameList),
  ("/.*?", MainPage),
], debug=True)
