import re
# Calculate LPD scores for a password.
# @param dictionary for scores to be added to, password to be scored, label for dictionary to be used
# @return dictionary of scores for symbolstart, # chunks, # characters, unsentence-like caps, mixed character sequence, pronounceable, LDP 
def calculateLPDlist (current_LPD_list, current_password, label):

	# running total for current password's LPD
	current_LPD = 0
	# Stores phrases into which passwords are broken into
	phrases = []
	# Holds current phrase (subsection of the password)
	current_phrase = None


	current_password = current_password.strip()
	label = str(label)

##### Step 1 - Parse by symbol
	# Check the character at index 0 of current_password
	# If the character is a symbol,
	# 	Add 1 point to the LPD	
	if symbolStart(current_password):
		current_LPD += 1
		symbolStartFlag = 1
		print('Symbol start: Add 1')
		current_LPD_list[label+'symbolStart'] = 1
	else:
		symbolStartFlag = 0
		current_LPD_list[label+'symbolStart'] = 0

##### Parse into phrases
	if symbolStartFlag == 1:
		# For each character in current_password, 
		for c in current_password:
			# If the char is a symbol,
			if isSymbol(c): 
				# Add current phrase to phrase list if not empty
				if current_phrase:
					
					phrases.append(current_phrase)
				
				# Increment current_phrase
				current_phrase = None

				# Add symbol to the start of the current phrase
				if not current_phrase:
					current_phrase = ''
				current_phrase += c
			else: 
				 # Concatenate the character at the end of current phrase
				if not current_phrase:
					current_phrase = '' 
				current_phrase += c
	else:
		# For each character in current_password, 
		for c in current_password:
			# If the char is a symbol,
			if isSymbol(c): 
				# Add symbol to the end of the current phrase
				if not current_phrase:
					current_phrase = ''
				current_phrase += c
				
				# Add current phrase to phrase list if not empty
				phrases.append(current_phrase)
				
				# Increment current_phrase
				current_phrase = None
			else: 
				 # Concatenate the character at the end of current phrase
				if not current_phrase:
					current_phrase = '' 
				current_phrase += c

	# Add the last phrase to the list
	if current_phrase: 
		phrases.append(current_phrase.strip())

	current_phrase = None

##### Step 2 - Number of phrases
	score = numPhrases(phrases)

	# Display and append score to current LPD list
	# Increment total LPD
	print('Num phrases score: ' + str(score))
	current_LPD += score
	current_LPD_list[label+'chunks'] = score

	# Display all phrases generated
	print('\nAll phrases: ')
	print(phrases)
	
	# Create to keep track of running total for phrase size score, mixed character score, un-sentence like capital score, and pronounceability score
	len_score = 0
	mix_score = 0
	cap_score = 0
	pron_score = 0

	# Test each phrase in phrases:
	for p in phrases:
####### Step 3 - Phrase size
		score = numChar(len(p))
		len_score += score
		print('Large phrase size score: ' + str(score))

####### Step 4 - Un-sentence like capitalization
		# For each character string,
		# If there is a letter in a position other than index 0 that is capitalized, add 1 to LPD
		score = unsentCaps(p)
		cap_score += score
		print('Un-sentence like capitalization: ' + str(cap_score))

####### Step 5 - mixed character strings
		# If the phrase has 3 or more characters and has the pattern L(N*)L or N(L*)N (mixed numbers and letters)
		# Add 1 to LPD
		mix_score += mixedCharStr(p)
		print('Mixed character strings: ' + str(mixedCharStr(p)))

######## Step 6 - pronounceable character sequence
		# If the phrase is pronounceable
		# Add 1 to LPD
		pron_score += soundsLike(p)

	# Add LPD scores to totall running LPD for steps 3, 4, 5, 6
	current_LPD += mix_score
	current_LPD += cap_score
	current_LPD += len_score
	current_LPD += pron_score

	# Add LPD scores  to the list for steps 3, 4, 5, 6
	current_LPD_list[label+'characters'] = len_score
	current_LPD_list[label+'unsentenceLikeCaps'] = cap_score
	current_LPD_list[label+'mixedCharacterString'] = mix_score
	current_LPD_list[label+'pronounceable'] = pron_score
	current_LPD_list[label+'lpd'] = current_LPD

	# clear variables
	mix_score = 0
	cap_score = 0
	len_score = 0
	pron_score = 0

	phrases = []
	score = 0
	# Set LPD to 0
	current_LPD = 0

	return current_LPD_list

# Determines whether symbol at start of string is a symbol
def symbolStart (password):
	return isSymbol(password[0])

# Determines whether passed character is a symbol
def isSymbol (c):
	if  c == '!' or c == '@' or c == '#' or c == '$' or c == '%' or c == '^' or c == '&' or c == '*' or c == '(' or c == ')' or c == '-' or c == '_' or c == '+' or c == '=' or c == '{' or c == '}' or c == '[' or c == ']' or c == '|' or c == '\\' or c == ':' or c == ';' or c == '\'' or c == '"' or c == '<' or c == '>' or c == ',' or c == '.' or c == '/' or c == '?' or c == '`' or c == '~':
		return True
	else:
		return False

# Determines LPD based on number of phrases
def numPhrases (phrases):
	LPD = 0

	# Get the size of phrases:
	phrase_size = len(phrases)
	# If phrase size is neither 1 or 2
	if (phrase_size != 1) and (phrase_size != 2):
	# Add score to LPD
		LPD = (((phrase_size - 3) * 2) + 1)
	else:
		LPD = 0

	return LPD

# Determines LPD based on phrase size
def numChar (phrase_size):

	# If 1 <= size <= 3:
	LPD = 0
	
	# If 4 <= size <= 5:
	if (phrase_size == 4) or (phrase_size == 5):
	# 	Add 1 to LPD
		LPD = 1
	# If 6 <= size <= 7:
	elif  (phrase_size == 6) or (phrase_size == 7):
	# 	Add 2 to LPD
		LPD = 2
	# If 8 <= size <= 9:
	elif  (phrase_size == 8) or (phrase_size == 9):
	# 	Add 3 to LPD
		LPD = 3
	# If 10 <= size <= 11:
	elif  (phrase_size == 10) or (phrase_size == 11):
	# 	Add 4 to LPD
		LPD = 4
	# If 12 <= size <= 13:
	elif  (phrase_size == 12) or (phrase_size >= 13):
	# 	Add 5 to LPD
		LPD = 5

	return LPD

def unsentCaps (password):
	LPD = 0

	match = re.findall('([a-zA-Z]+)[A-Z]([a-zA-Z]*)', password)
	if match:
		LPD += 1

	return LPD

def mixedCharStr (password):
	LPD = 0

	if len(password) >= 3:
		match = re.findall('([0-9]+[a-zA-Z]+[0-9]+)|([a-zA-Z]+[0-9]+[a-zA-Z]+)', password, re.I)
		if match:
			LPD += 1

	return LPD

def soundsLike (phrase):
	# Method that returns an integer score for level of pronounceability of a word depending on how many different matching syllables
	# Uses the onset-nucleus-coda syllable classification scheme used in English phonology. 
	# Created with theoretical 

	# Pull letter groups that match the following:
	# Regex: [possible onset consonants][possible nucleus letters][possible coda letter sequences]

	onset = "(P|B|T|D|K|G|W|F|Ph|V|Th|S|Z|M|N|L|R|W|H|Y|Sh|Ch|J|Pl|Bl|Kl|Gl|Pr|Br|Tr|Dr|Kr|Gr|Tw|Dw|Gw|Kw|Pw|Sp|Sk|St|Sm|Sn|Sph|Sth|Spl|Scl|Spr|Str|Scr|Squ|Sm|Sphr|Wr|Gn|Xy|ps)"
	nucleus = "(I|E|A|O|U|Oo|Ea|Ir|Y|Oy|ee|ea|ou|o|ow)"
	coda = "(P|B|T|D|K|G|H|J|W|F|Ph|V|Th|S|Z|M|N|L|R|Q|Y|Sh|C|Lp|Lb|Lt|Lch|Lge|Lk|Rp|Rb|Rt|Rd|Rch|Rge|Rk|Rgue|Lf|Lve|Lth|Lse|Lsh|Rf|Rve|Rth|Rce|Rs|Rsh|Lm|Ln|Rm|Rn|Rl|Mp|Nt|Nd|Ch|Nge|Nk|Mph|Mth|Nth|Nce|Nze|Gth|Ft|Sp|St|Sk|Fth|Pt|Ct|Pth|Pse|Ghth|Tz|Dth|X|Lpt|Lfth|Ltz|Lst|Lct|Lx|Mth|Rpt|Rpse|Rtz|Rst|Rct|Mpt|Mpse|Ndth|Nct|Nx|Gth|Xth|xt|ng)"
	
	specials = "(hm|(" + onset + "*8(T|Th|S)))" # 1337 and other pneumonics can be added here

	score = 0

	regex = ".*((" + onset + "*" + nucleus + "{1}" + coda + "{1})|" + "(" + onset + "{1}" + nucleus + "{1}" + coda + "*)|" + specials + ").*"
	regex = regex.lower()

	match = re.findall(regex, phrase, re.I)
	if match:
		for sylb in match:
			score = -1
			print("Pronounceable: " + str(sylb[0]))

	return score