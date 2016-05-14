import logging
import os
# Our basic MVC frameworks for the backend
import webapp2
from google.appengine.api import mail

# Encode urls
from base64 import b64encode, b64decode
# Generate random hashes for session id
import random
import xmltodict
import urllib2
import json
import secret

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
    index = random.randint(r[wordtype][0], len(z))
    line = z[index]
    d = line.split('|')
    definition = d[-1]
    word = d[0].split(' ')[4]
    word = word.replace('_',' ')
    out = {'def':definition, 'word':word}

    self.response.write(json.dumps(out))

class GetEmotion(webapp2.RequestHandler):
  def get(self):
    x = open('data.emotion')
    z = x.readlines()
    index = random.randint(0,len(z))
    line = z[index]
    out = {'word':line.lower()}

    self.response.write(json.dumps(out))

class GetTitle(webapp2.RequestHandler):
  def get(self):
    x = open('out.txt')
    z = x.readlines()
    index = random.randint(0,len(z))
    line = z[index]
    d = line.split('|')
    out = {'def':d[1], 'word':d[0]}
    self.response.write(json.dumps(out))

class GetTweets(webapp2.RequestHandler):
  def get(self,userid):
    bearer = secret.bearer

    url = 'https://api.twitter.com/1.1/statuses/user_timeline.json?count=200&screen_name='+userid+'&exclude_replies=false&include_rts=false'
    headers = {'Authorization':'Bearer '+ bearer}

    request = urllib2.Request(url, headers=headers)
    contents = urllib2.urlopen(request).read()
    self.response.write(contents)


class ContactEmail(webapp2.RequestHandler):
  def post(self,type):
    x = json.loads(self.request.body)
    logging.info(x)
    if not x['isvariant']:
      if not x.has_key('name'):
        x['name'] = 'Unknown'
      if not x.has_key('description'):
        x['description'] = 'Unknown'
      body = "<item>\n    <name>"+x['name']+"</name>\n    <description>"+x['description']+"</description>\n"
      for thing in ['variants', 'altnames', 'relatedtags']:
        if x.has_key(thing):
          if thing == 'variants':
            ltag = "variations"
            stag = "variant"
            z = x[thing].split('\n')

          elif thing == 'altnames':
            ltag = "aliases"
            stag = "alias"
            z = x[thing].split('\n')

          elif thing == "relatedtags":
            ltag = "tags"
            stag = "tag"
            z = x[thing].keys()

          body += "    <"+ltag+">\n"
          for v in z:
            body += ("        <"+stag+">"+v+"</"+stag+">\n")
          body += "    </"+ltag+">\n"
      body += "</item>"

    elif x['isvariant']:
      body = "<variations>\n"
      if x.has_key('description'):
        body += "    <variant"
        if x.has_key('name'):
          body += " name='" + x['name']+"'"
        body += ">"+x['description']+"</variant>\n"
      body += "</variations>"

    for o in ['author', 'notes']:
      if x.has_key(o):
        body += "\n\n"+o+": "+x[o]

    message = mail.EmailMessage(sender='rob.whitehead@gmail.com',subject='Playbook game submission')
    message.to = 'rob.whitehead@gmail.com'
    message.body = body
    message.send()
    logging.info(body)




application = webapp2.WSGIApplication( [
  ("/api/game/(.*)", GameList),
  ("/api/word/title", GetTitle),
  ("/api/word/emotion", GetEmotion),
  ("/api/word/(.*)", GetWord),
  ("/api/submit/(.*)", ContactEmail),
  ("/api/tweets/(.*)", GetTweets),


], debug=True)
