files = ['object','person']
out = []
for plz in files:
  x = open('noun.'+plz)

  x = x.readlines()
  x = x[9:]

  chars = '[]{}'


  for line in x:
    for char in chars:
      line = line.replace(char,'')

    z = line.split(',')
    p = z[0].replace(' ','')
    p = p.replace('_', ' ')
    nums = '0123456789'
    for num in nums:
      p = p.replace(num, '')


    if p[0].isupper():
      openpairs = 1
      expl = line
      l = len(line)
      counter = 1
      endparen = 0
      while openpairs > 0 and counter < l:
        c = expl[-counter]
        if c == ')':
          if not endparen > 0:
            endparen = counter
          else:
            openpairs += 1

        if c == '(':
          openpairs -= 1

        counter += 1
      startparen = counter
      out.append(p+"|"+expl[l-startparen+2:l-endparen]+"\n")
    else:
      pass

o = open('out.txt','w')

for thing in out:
  o.write(thing)

o.close()
