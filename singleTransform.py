#!/usr/bin/python
##########################################################################
## This program takes a string as input (a password) and                ##
##  rearranges the password.				                            ##
##########################################################################
# How to use: singleTransform.permutePass(password)                     ##
# Note: you must import this file "import singleTransform" before use   ##
##########################################################################

import sys
import timeit
import re


##  Runs through each character of a string and
##  places it into an array  
def permutePass(password):
	# Create arrays to hold characters
	lowerArray = []
	upperArray = []
	digitArray = []
	symbolArray = []

	upper = lower = digit = space = 0
	for c in password:
		if c in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
                        upper += 1
                        upperArray.append(c)
		elif c in "abcdefghijklmnopqrstuvwxyz":
			lower += 1
			lowerArray.append(c)
		elif c in "0123456789":
			digit += 1
			digitArray.append(c)
		else : 
			symbolArray.append(c)


	# .join merges characters from an array into a string 
	tempUpperPass = ''.join(upperArray)
	tempLowerPass = ''.join(lowerArray)
	tempDigitPass = ''.join(digitArray)
	tempSymbolPass = ''.join(symbolArray)

	# Concatenate all the strings
	newPass = tempUpperPass + tempLowerPass + tempDigitPass + tempSymbolPass

	print('Permuted password: '+str(newPass))

	# print result
	return newPass

