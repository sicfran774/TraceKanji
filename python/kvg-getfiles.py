import sys
from utils import listSvgFiles, canonicalId, PYTHON_VERSION_MAJOR

if PYTHON_VERSION_MAJOR > 2:
	def unicode(s):
		return s
	def unichr(c):
		return chr(c)

def commandFindSvg(id, outputFile):
	kanji = [(f.path, f.read()) for f in listSvgFiles("./kanji/") if f.id == id]
	print("Found %d files matching ID %s" % (len(kanji), id))
	for i, (path, c) in enumerate(kanji):
		outputFile.write(path + "\n")
		break


if __name__ == "__main__":
	outputFile = open("./test/output.txt", "a")
	with open("./test/input.txt", "r", encoding="utf8") as f:
		while True:
			c = f.read(1)
			if not c:
				print("End of file")
				break
			id = canonicalId(c)
			commandFindSvg(id, outputFile)
	