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

# this function returns game data
class GameList(webapp2.RequestHandler):
  def get(self, name):
    x = open('iprov.xml')
    data = x.read()
    d = xmltodict.parse(data)
    c = json.dumps(d['dataroot']['item'])

    self.response.status = 200
    self.response.write(c)

class TagList(webapp2.RequestHandler):
  def get(self):
    x = open('iprov.xml')
    data = x.read()
    d = xmltodict.parse(data)
    c = d['dataroot']['item']
    out = {}
    for item in c:
      a = item['tags']['tag']
      #turn the ones that are strings into lists
      if len(a[0]) == 1:
        a = [a]
      for tag in a:
        try:
          out[tag] += 1
        except KeyError:
          out[tag] = 1
    self.response.status = 200
    self.response.write(json.dumps(out))



application = webapp2.WSGIApplication( [
  ("/api/game/(.*)", GameList),
  ("/api/tags/", TagList),
], debug=True)
