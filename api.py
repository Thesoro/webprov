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
    x.close()
    self.response.status = 200
    self.response.write(c)

class GetWord(webapp2.RequestHandler):
  def get(self,wordtype):
    r = {'adj':[30,18185], 'noun':[30,82144], 'verb':[30,13796], 'adv':[30,3650]}
    x = open("data."+wordtype)
    z = x.readlines()
    index = random.randint(r[wordtype][0], r[wordtype][1])
    line = z[index]
    d = line.split('|')
    definition = d[-1]
    word = d[0].split(' ')[4]
    word = word.replace('_',' ')
    out = {'def':definition, 'word':word}

    self.response.write(json.dumps(out))

class GetTitle(webapp2.RequestHandler):
  def get(self):
    x = open('out.txt')
    z = x.readlines()
    index = random.randint(0,5846)
    line = z[index]
    d = line.split('|')
    out = {'def':d[1], 'word':d[0]}
    self.response.write(json.dumps(out))

class ContactEmail(webapp2.RequestHandler):
    def post(self,type):
        logging.info('ok')


application = webapp2.WSGIApplication( [
  ("/api/game/(.*)", GameList),
  ("/api/word/title", GetTitle),
  ("/api/word/(.*)", GetWord),
  ("/api/email/(.*)", ContactEmail),


], debug=True)
