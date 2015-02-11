import re

# Calculate number of keystrokes needed for a password entered in the mobile Apple brand platform

# Each "screen" method simulates a real screen on the device.
# In this model, each keypress does not trigger an automatic transition back to screen 1. 

# Ipad keystroke count based on the screens of the latest 2014 model
# Android keystroke count based on the landscape screens of the Galaxy 3s, the most pervasive model (7.2% of Android users) in the Android marketplace as of July 2014


# screens
def screen1 (password, count, i, type):
	if i < len(password):
		symType = symbolType[type](password[i])
		i += 1

		if symType == 0:
			count += 1
			return screen1(password, count, i, type)
		elif symType == 1:
			count += 2
			return screen1(password, count, i, type)
		elif symType == 2:
			count += 2
			return screen2(password, count, i, type)
		else: 
			count += 3
			return screen3(password, count, i, type)
	else:
		return count

def screen2 (password, count, i, type):
	if i < len(password):
		i += 1
		symType = symbolType[type](password[i])
		if symType == 0:
			count += 2
			return screen1(password, count, i, type)
		elif symType == 1:
			count += 3
			return screen1(password, count, i, type)
		elif symType == 2:
			count += 1
			return screen2(password, count, i, type)
		else: 
			count += 2
			return screen3(password, count, i, type)
	else:
		return count

def screen3 (password, count, i, type):
	if i < len(password):
		symType = symbolType[type](password[i])
		i += 1
		if symType == 0:
			count += 2
			return screen1(password, count, i, type)
		elif symType == 1:
			count += 3
			return screen1(password, count, i, type)
		elif symType == 2:
			count += 2
			return screen2(password, count, i, type)
		else: 
			count += 1
			return screen3(password, count, i, type)
	else:
		return count

def upLower (character):
	# Character is a lower
	regex = "[a-z]"
	match = re.findall(regex, character)
	if match:
		return 0

	# Character is an upper (add one keystroke for shift)
	regex = "[A-Z]"
	match = re.findall(regex, character)
	if match:
		return 1

def upLowerSymDesktop (character):
	# Character is a lower, or other character that doesn't require a shift press
	regex = "[a-z]|[0-9]|`|\[|\]|;|'|,|\.|\/|\-|\="
	match = re.findall(regex, character)
	if match:
		return 0

	# Character is an upper or other character requiring a shift press
	regex = "[A-Z]"
	match = re.findall(regex, character)
	if match:
		return 1

def upLowerSymipad(character):
	notSym = upLower(character);

	if notSym == -1:
		# Character is a symbol in ipad group 1
		regex = "[0-9]|-|\/|:|;|\)|\(|&|\$|@|\.|,|\?|!|\"|\'"
		match = re.findall(regex, character)
		if match:
			return 2

		# Character is a symbol in ipad group 2
		return 3

	else: 
		return notSym

def upLowerSymandroid(character):
	notSym = upLower(character);

	if notSym == -1:
		# Character is a symbol in android group 1
		regex = "[0-9]|\^|\*|-|\/|:|;|\)|\(|&|\$|@|\.|,|\?|!|\"|\'"
		match = re.findall(regex, character)
		if match:
			return 2

		# Character is a symbol in android group 2
		return 3

	else: 
		return notSym

def upLowerSymandroid(character):
	notSym = upLower(character);

	if notSym == -1:
		# Character is a symbol you must hit shift to access
		regex = "[0-9]|\\^|*|-|/|:|;|\\)|\\(|&|\\$|@|\\.|,|\\?|!|\"|'|"
		match = re.findall(regex, character)
		if match:
			return 2

	else: 
		return notSym

symbolType = {
	'ipad': upLowerSymipad,
	'android': upLowerSymandroid,
	'desktop': upLowerSymDesktop,
}

# Main method to invoke for ipod
def ipadkeystrokecount(password):
	count = 0
	count = screen1(password, count, 0, "ipad")

	return count

# Main method to invoke for android
def androidkeystrokecount(password):
	count = 0
	count = screen1(password, count, 0, "android")

	return count

def desktopkeystrokecount(password):
	count = 0
	count = screen1(password, count, 0, "desktop")

	return count

# Main method to add all keystroke types for two versions of the same password to an existing list
def calcKeystrokeList(current_LPD_list, password, label):
	# Calculate android keystrokes
	current_LPD_list[label+'androidkeystrokes'] = androidkeystrokecount(password)
	current_LPD_list[label+'ipadkeystrokes'] = ipadkeystrokecount(password)
	current_LPD_list[label+'desktopkeystrokes'] = desktopkeystrokecount(password)
	return current_LPD_list