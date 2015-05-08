#!/usr/bin/python
##############################################################
## This program calculates the difference of the original   ##
##  entropy and entropy loss due to the usability transform.##
###############################################################################################
# How to use: multiEntropyLoss.entropyData(current_dictionary, password)                     ##
# Note: you must import this file "import multiEntropyLoss" before use                       ##
###############################################################################################

# No external libraries are required
import sys
from datetime import date
from operator import mul 
from fractions import Fraction
import string 
import math
import time
import functools

# Calculates n Choose k (n elements in k combinations) 
def nCk(n,k): 
  return int( functools.reduce(mul, (Fraction(n-i, i+1) for i in range(k)), 1) )

# Calculate simple password entropy
def calcOrigEnt(input):
	localLengthVar = len(input)
	
	# This is an important line!
	## Change 94 to calculate entropy 
	## for alternative char pool sizes
	mid = 94**localLengthVar
	output = math.log(mid, 2)
	return output

# Calculate the number of lowercase letters in a password
def numberOfLowers(string):
    return sum(1 for c in string if c.islower())

# Calculate the number of uppercase letters in a password
def numberOfUppers(value):
	localLength = sum(1 for c in value if c.isupper())
	return localLength

# Calculate the number of digits in a password
def numberOfDigits(value):
	localLength = len([c for c in value if c.isdigit()])
	return localLength

# Calculate the entropy loss due to the usability password transform
def calcLoss(length, upper, lower, digits):
	# Storing and casting local vars
	length = length
	upper = int(upper)
	lower = int(lower)
	digits = int(digits)
	# n Choose k of uppercase chars
	nCkUpper = nCk(length, upper) 
	tempvar1 = length - upper
	# n Choose k of lowercase chars
	nCkLower = nCk(tempvar1, lower)
	tempvar2 = length - upper - lower
	nCkDigits = nCk(tempvar2, digits) 
	intermediateResult = nCkUpper * nCkLower * nCkDigits
	finalResult = math.log(intermediateResult, 2)
	#finalResult = np.log2(intermediateResult)
	return finalResult 

# Subtract the entropy loss from the original entropy
def calcKelseyEnt(originalEntropy, entropyLoss):
	finalResult = originalEntropy - entropyLoss
	return finalResult

# Add entropy information of a password to a dictionary
# @param dictionary, password
# @return updated dictionary
def entropyData(current_dictionary, password):
	tempLower = numberOfLowers(password)
	tempUpper = numberOfUppers(password)
	tempDigits = numberOfDigits(password)
	length = len(password)
	tempSymb = length - tempUpper - tempLower - tempDigits
	originalEntropy = calcOrigEnt(password)
	tempLoss = calcLoss(length, tempUpper, tempLower, tempDigits)
	newPasswordStrength = calcKelseyEnt(originalEntropy, tempLoss)
	percentLoss = tempLoss/originalEntropy*100

	current_dictionary['originalEntropy'] = originalEntropy
	current_dictionary['lostEntropy'] = tempLoss
	current_dictionary['percentEntropyLoss'] = percentLoss
	current_dictionary['newEntropy'] = newPasswordStrength

	print('Original entropy: ' + str(originalEntropy))
	print('Lost entropy: ' + str(tempLoss))
	print('Percent entropy lost: ' + str(percentLoss))
	print('New (Kelsey) entropy: ' + str(newPasswordStrength))

	return current_dictionary

# Write results to an external file
## The file is opened and closed to clear it
# now = date.today()
# tempResultsFile = 'formattedResults-'  + str(now) + '.txt'
# resultsFile = open(tempResultsFile, "w")
# resultsFile.close()
# resultsFile = open(tempResultsFile, "a")

# # Open password file
# ## This program requires a file named inputFile.txt
# ## CHANGE THIS LINE TO INCLUDE ANOTHER FILE 
# inputFile = open('inputFile-10.txt', 'r')

# for line in inputFile: 
# 	line = line.rstrip()
# 	length = len(line)
# 	print(line + " : " + "\n")
# 	tempLower = numberOfLowers(line)
# 	tempUpper = numberOfUppers(line)
# 	tempDigits = numberOfDigits(line)
# 	tempSymb = length - tempUpper - tempLower - tempDigits
# 	originalEntropy = calcOrigEnt(line)
# 	tempLoss = calcLoss(length, tempUpper, tempLower, tempDigits)
# 	newPasswordStrength = calcKelseyEnt(originalEntropy, tempLoss)
# 	percentLoss = tempLoss/originalEntropy*100
# 	print("The original entropy measure is " + str(originalEntropy) + "\n")
# 	print("The entropy loss is " + str(tempLoss) + "\n")
# 	print("The Kelsey entropy is " + str(newPasswordStrength) + "\n")
# 	print("The percentage loss is " + str(percentLoss) + "\n")
# 	resultsFile.write("\n")
# 	# Log the results to a file with the following format
# 	# Password, length, uppers, lowers, digits, symbols, original entropy, entropy loss, kelsey entropy, percent loss
# 	#resultsFile.write(str(line) + ", " + str(length) + ", " + str(tempUpper) + ", " + str(tempLower) + ", " + str(tempDigits) + ", " + str(tempSymb) + ", " + str(originalEntropy) + ", " + str(tempLoss) + ", " + str(newPasswordStrength) + ", " + str(percentLoss))
# 	resultsFile.write(str(line) + "\t" + str(length) + "\t" + str(tempUpper) + "\t" + str(tempLower) + "\t" + str(tempDigits) + "\t" + str(tempSymb) + "\t" + str(originalEntropy) + "\t" + str(tempLoss) + "\t" + str(newPasswordStrength) + "\t" + str(percentLoss))
# inputFile.close()
