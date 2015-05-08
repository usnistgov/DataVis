# Automate Rating Usability of Generated Passwords
# Cathryn Ploehn

# Python 3.4.0

# Takes a text file containing a list of generated passwords and rates each password based on its total difficulty (LPD) 
# and score for each step of the LPD algorithm according to a scale based on structural properties. 
# 
# Outputs a CSV file in this format:
# 
# originalPassword,symbolStart,chunks,characters,unsentenceLikeCaps,mixedCharacterString,pronounceable,lpd
# 5c2'Qe,0,0,1,0,1,0,2
# 
#
# This program looks for an input file in the directory named input/passwords.txt formatted like the following:
# 
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

# Dependent on these libraries:
import csv
import re

# Dependent on these external python files
#   Created by Cathryn Ploehn
import lpdAlgorithm
import keystrokeAlgorithm
import characterCount

#   Created by Joshua Franklin
import permutedPasswordEntropyLoss
import permutePassword


print ("\n\nAutomate Rating Usability of Generated Passwords by Cathryn Ploehn\n\n" +
	"################\n\n" +
"Takes a text file containing a list of generated passwords and rates each password based on its total difficulty (LPD) and score for each step of the LPD algorithm according to a scale based on structural properties.\n\n" +
"Outputs a CSV file in this format:\n" +
"Password\tLPD\tStep 1\tStep 2\tStep 3\tStep 4\tStep 5\tStep 6\n" +
"$g7)81ragUfSvb\t5\t1\t0\t0\t5\t0\t-1\n\n")

# Data I/O
# Ask user for name of file where passwords are stored
outputFilename = input("Enter the name of the output file: ")
outputFilename = "output/" + outputFilename
print("Processing...\n\n")

################ Change input file here #######################
# Open file with passwords stored
i = open('input/QA-test-1.txt', 'r')

# Parse input
# Stores current LPD scores for each step of the algorithm (only for the current password)
current_LPD_list = {}
# Stores all passwords from input file
passwords = []
# Stores current password being rated
current_password = ""
# stores lists of arrays with LPD scores for each step and total LPD scores of each password
USG_list = []
# Holds current phrase (subsection of the password)
current_phrase = None

# Read a password from file input
for line in i:
    # Store the password string at the end of passwords and assign to current_password
    current_password = line
    passwords.append(current_password)
    print("\n"+current_password)

    # Add LPD calculations
    current_LPD_list = lpdAlgorithm.calculateLPDlist(current_LPD_list, current_password, '')
    current_LPD_list['originalPassword'] = current_password.strip()

    # Permute password
    current_LPD_list['permutedPassword'] = permutePassword.permutePass(current_LPD_list['originalPassword'])
    current_LPD_list = lpdAlgorithm.calculateLPDlist(current_LPD_list, current_LPD_list['permutedPassword'], 'new')

    # Calculate entropy
    current_LPD_list = permutedPasswordEntropyLoss.entropyData(current_LPD_list,current_LPD_list['originalPassword'])
    
    # Calculate keystrokes
    current_LPD_list = keystrokeAlgorithm.calcKeystrokeList(current_LPD_list, current_LPD_list['originalPassword'], '')
    current_LPD_list = keystrokeAlgorithm.calcKeystrokeList(current_LPD_list, current_LPD_list['permutedPassword'], 'new')

    
    # Calculate length, number of letters, number of numerics and number of symbols in each password
    current_LPD_list['length'] = len(current_LPD_list['originalPassword'])
    current_LPD_list['numLetters'] = characterCount.countLetters(current_LPD_list['originalPassword'])
    current_LPD_list['numNumbers'] = characterCount.countNumbers(current_LPD_list['originalPassword'])
    current_LPD_list['numSymbols'] = characterCount.countSymbols(current_LPD_list['originalPassword'])

    # Store current LPD score list in USG_list  
    USG_list.append(current_LPD_list)
    current_LPD_list = {}

# Data I/O
# Get the name of a target file to be written to and create file for raw password data
newoutputFilename = outputFilename + ".csv";
with open(newoutputFilename, 'w', newline='') as csvfile:
    ratingwriter = csv.writer(csvfile, delimiter=',')
    ratingwriter.writerow(['originalPassword'] + ['symbolStart'] + ['chunks'] + ['characters'] + ['unsentenceLikeCaps'] + ['mixedCharacterString'] + ['pronounceable'] + ['lpd'] + ['entropy'] + ['permutedPassword'] + ['newentropy'] + ['lostEntropy'] + ['percentEntropyLoss'] + ['newsymbolStart'] + ['newchunks'] + ['newcharacters'] + ['newunsentenceLikeCaps'] + ['newmixedCharacterString'] + ['newpronounceable'] + ['newlpd'] + ['ipadkeystrokes'] + ['newipadkeystrokes'] + ['androidkeystrokes'] + ['newandroidkeystrokes'] + ['desktopkeystrokes'] + ['newdesktopkeystrokes'] + ['passwordlength'] + ['numLetters'] + ['numNumbers'] + ['numSymbols'])

    # print("\n\nScores:")
    password_index = 0
    for score_list in USG_list:
    	#store current row
    	current_row = USG_list[password_index]
    	
    	# print password output
    	# print("\n"+passwords[password_index].strip()+": ")
    	# print(current_row)
    	
    	ratingwriter.writerow([current_row['originalPassword'].strip()] + [current_row['symbolStart']] + [current_row['chunks']] + [current_row['characters']] + [current_row['unsentenceLikeCaps']] + [current_row['mixedCharacterString']] + [current_row['pronounceable']] + [current_row['lpd']] + [current_row['originalEntropy']] + [current_row['permutedPassword'].strip()] + [current_row['newEntropy']] + [current_row['lostEntropy']] + [current_row['percentEntropyLoss']] + [current_row['newsymbolStart']] + [current_row['newchunks']] + [current_row['newcharacters']] + [current_row['newunsentenceLikeCaps']] + [current_row['newmixedCharacterString']] + [current_row['newpronounceable']] + [current_row['newlpd']]+[current_row['ipadkeystrokes']] + [current_row['newipadkeystrokes']] + [current_row['androidkeystrokes']] + [current_row['newandroidkeystrokes']] + [current_row['desktopkeystrokes']] +[current_row['newdesktopkeystrokes']]+ [current_row['length']] + [current_row['numLetters']] + [current_row['numNumbers']] + [current_row['numSymbols']])
    	password_index += 1

csvfile.closed

# Create file for changed metrics
newoutputFilename = outputFilename + "-change.csv"
with open(newoutputFilename, 'w', newline='') as newcsvfile:
    ratingwriter = csv.writer(newcsvfile, delimiter=',')
    ratingwriter.writerow(['originalPassword'] + ['symbolStart'] + ['chunks'] + ['characters'] + ['unsentenceLikeCaps'] + ['mixedCharacterString'] + ['pronounceable'] + ['lpd'] + ['entropy'] + ['permutedPassword'] + ['newentropy'] + ['newsymbolStart'] + ['newchunks'] + ['newcharacters'] + ['newunsentenceLikeCaps'] + ['newmixedCharacterString'] + ['newpronounceable'] + ['newlpd'] + ['ipadkeystrokes'] + ['newipadkeystrokes'] + ['androidkeystrokes'] + ['newandroidkeystrokes'] + ['desktopkeystrokes'] + ['newdesktopkeystrokes'] + ['passwordlength'] + ['numLetters'] + ['numNumbers'] + ['numSymbols'])
    
    # print("\n\nScores:")
    password_index = 0
    for score_list in USG_list:
        #store current row
        current_row = USG_list[password_index]
        
        # print password output
        # print("\n"+passwords[password_index].strip()+": ")
        # print(current_row)
        
        ratingwriter.writerow([current_row['originalPassword'].strip()] + [current_row['symbolStart'] - current_row['newsymbolStart']] + [current_row['chunks']-current_row['newchunks']] + [current_row['characters']-current_row['newcharacters']] + [current_row['unsentenceLikeCaps']-current_row['newunsentenceLikeCaps']] + [current_row['mixedCharacterString']-current_row['newmixedCharacterString']] + [current_row['pronounceable']-current_row['newpronounceable']] + [current_row['lpd']-current_row['newlpd']] + [current_row['originalEntropy']-current_row['newEntropy']] + [current_row['permutedPassword'].strip()] + [current_row['newEntropy']-current_row['originalEntropy']]+ [current_row['newsymbolStart'] - current_row['symbolStart']] + [current_row['newchunks']-current_row['chunks']] + [current_row['newcharacters']-current_row['characters']] + [current_row['newunsentenceLikeCaps']-current_row['unsentenceLikeCaps']] + [current_row['newmixedCharacterString']-current_row['mixedCharacterString']] + [current_row['newpronounceable']-current_row['pronounceable']] + [current_row['newlpd']-current_row['lpd']] +[current_row['ipadkeystrokes']-current_row['newipadkeystrokes']] + [current_row['newipadkeystrokes']-current_row['ipadkeystrokes']] + [current_row['androidkeystrokes'] - current_row['newandroidkeystrokes']] + [current_row['newandroidkeystrokes'] - current_row['androidkeystrokes']] + [current_row['desktopkeystrokes'] - current_row['newdesktopkeystrokes']] + [current_row['newdesktopkeystrokes'] - current_row['desktopkeystrokes']] + [current_row['length']] + [current_row['numLetters']] + [current_row['numNumbers']] + [current_row['numSymbols']])
        password_index += 1

newcsvfile.closed