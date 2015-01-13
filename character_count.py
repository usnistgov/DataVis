import re

def countLetters(password):
	password = password.strip()
	count = 0

	regex = "[A-Za-z]"

	match = re.findall(regex, password)
	if match:
		count = len(match)

	return count

def countNumbers(password) :
	count = 0

	regex = "[0-9]"
	regex = regex.lower()

	match = re.findall(regex, password, re.I)
	if match:
		count = len(match)

	return count

def countSymbols(password) :
	count = 0

	regex = "[a-zA-Z0-9]"
	regex = regex.lower()

	match = re.findall(regex, password, re.I)
	if match:
		count = len(password) - len(match)

	return count
