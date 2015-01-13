# Extract word chunks from Generated Passwords
# Cathryn Ploehn
# 
#  Uses a regex function to produce a csv file containing the word chunks of an inout file of generated passwords
# This program looks for an input file in the same directory named passwords.txt formatted like the following:

# v1!_VL
# t4r!J1
# r]6J+N
# q856VW
# o5;*nX
# mo3u+H
# i2)2WQ
# g8:6AR
# d:4}nY
# c8>|NG
# 8l^Q-T
# 7s$U]p
# 7*pauR
# 5c2`Qe
# 4o6&4D
# 3qq:Q-
# 3.bH1o
# ...

import csv
import re

# Holds all password input
passwords = []

# Holds all arrays of word chunks in a password
password_chunks = []

# Stores current list of word chunks in current password
current_chunk_list = []

# Data I/O
# Ask user for name of file where passwords are stored
outputFilename = input('Enter the name of the output file: ')
outputFilename += ".csv"
print("Processing...\n\n")

# Open file with passwords stored
i = open('passwords.txt', 'r')

# for every password
for line in i:
	# Get each password into an array
	passwords.append(line)

	# Get array of word chunks and store them in the current list
	match = re.findall('([a-zA-Z]{2,})', line)
	if match:
		for chunk in match:
			current_chunk_list.append(chunk)
	else:
		current_chunk_list.append("None")

	# Append chunk list to password_chunks
	password_chunks.append(current_chunk_list)
	current_chunk_list = []

# Data I/O
# Get the name of a target file to be written to and create the file
with open(outputFilename, 'w', newline='') as csvfile:
    ratingwriter = csv.writer(csvfile, delimiter=',')
    ratingwriter.writerow(['Password'] + ['Word chunks'])

    password_index = 0
    for password in passwords:
    	print(password_chunks[password_index])
    	
    	current_chunk_list = password_chunks[password_index]

    	if current_chunk_list[0] != "None":
	    	ratingwriter.writerow([passwords[password_index].strip()] + [password_chunks[password_index]])
    	password_index += 1

csvfile.closed