# To use the script:
# 1. Create "input.txt" and "output.txt" files
# 2. Put desired kanjis into input.txt, no spaces or newlines (i.e. 亜哀愛挨悪握圧扱)
# 3. Run script, output string will be in output.txt to be inputted into MongoDB

# {
#   "_id": { "$oid": "64c48382c731a8a0b826e5f7" },
#   "kanji": "kanji","svg": "blah"
# }

import sys
from utils import listSvgFiles, canonicalId, PYTHON_VERSION_MAJOR

if PYTHON_VERSION_MAJOR > 2:
	def unicode(s):
		return s
	def unichr(c):
		return chr(c)

def commandFindSvg(id):
	kanji = [(f.path, f.read()) for f in listSvgFiles("./kanji/") if f.id == id]
	print("Found %d files matching ID %s" % (len(kanji), id))
	for i, (path, c) in enumerate(kanji):
		return path
	
def convertIntoJson(kanjiFiles, kanjis):
	finalJson = "["
	for (path, c) in zip(kanjiFiles, kanjis):
		# Kanji
		finalJson += ("{\"kanji\":\"%s\",\"svg\":\"" % c)
		# SVG
		f = open(path, "r", encoding="utf8")
		# trim any newlines/tabs
		svg = f.read()
		unformatted = ' '.join(svg.split())
		# add escapes to quotes
		unformatted = unformatted.replace('"','\\"')
		finalJson += "%s\"}," % unformatted
		f.close()
	finalJson += "]"
	return finalJson

if __name__ == "__main__":
	kanjiPaths = []
	kanjis = []
	outputFile = open("./output.txt", "a", encoding="utf8")

	#Go through each character in input.txt
	with open("./input.txt", "r", encoding="utf8") as f:
		while True:
			c = f.read(1)
			if not c:
				print("End of file")
				break

			kanjis.append(c)
			id = canonicalId(c)
			kanjiPaths.append(commandFindSvg(id))

	json = convertIntoJson(kanjiPaths, kanjis)
	outputFile.write(json)
	outputFile.close()
	