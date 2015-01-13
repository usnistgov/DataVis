Automate Rating Usability of Generated Passwords
Cathryn Ploehn

Background
In order to better improve the usability of generated passwords, different components should be measured. A scale has been created to measure the linguistic and phonological difficulty component of these passwords (LDP).
The basis of the LDP scale takes into account previous NIST studies and new observational studies of participants. People tend to decompose passwords into smaller “phrases” at non alphanumeric characters. (~!@#$%^&*, etc). This decomposition also indicated phrase size was a factor in how people parse passwords. Furthermore, pronounceability of password segments was also a factor reducing memory load.  

What this program does
This program automates the rating of the LDP scale, entropy, producing an output file marking the total LDP score and the score at every step of the algorithm.

The 

Usage
Run USG.py via the command line. Enter the name of the desired output file. The program will output text describing the rating of the LDP at each step. 

Input
A text file containing passwords, each separated by a newline. 

Example:
Hbo31.
Qce52'
Hmfw361)
Cat72?#
TYpdx4463*
Xduwrf5143);
UCqmv802</
EHVnim6043%'
QMifnh455230_$
Rmofpaf2207#)^

Output
Output is a CSV file formatted like the following:
Password	Symbol start	# chunks	# characters	Un-sentence like caps	mixed character string	pronounceable	LDP	entropy	
Hbo31.	0	0	2	0	0	-1	1
Qce52'	0	0	2	0	0	0	2
Hmfw361)	0	0	3	0	0	-1	2
Cat72?#	0	1	2	0	0	-1	2
TYpdx4463*	0	0	4	1	0	-1	4
Xduwrf5143);	0	1	4	0	0	-1	4
UCqmv802</	0	1	3	1	0	0	5
EHVnim6043%'	0	1	4	1	0	-1	5
QMifnh455230_$	0	1	5	1	0	-1	6
Rmofpaf2207#)^	0	1	5	0	0	-1	5


The LDP algorithm used in this program is broken into 6 steps:
Step 1:  Parse by symbol.
If the first character of the given password is a character, add one point to the LDP.
Step 1.5: Break password into “phrases”.

Step 2: Count number of phrases. 
Is the number of phrases is 1 or 2, add nothing to the LDP. Otherwise, add value to the LDP based on:
LDP = ( (phrase-size – 3) x 2) + 1

The following steps apply to each individual phrase within a password.
Step 3: Calculate phrase size
Add LDP points for each phrase based on the following:
Phrase size	LDP assigned
1 <= x <= 3	0
4 <= x <= 5	1
6 <= x <= 7	2
8 <= x <= 9	3
10 <= x <= 11	4
2 <= x <= 13	5

The LDP for each phrase should be summed to form the total LDP for this step. Also, symbols will not be considered for the next steps.

Step 4: Un-sentence like capitalization
Consider only strings of characters within each phrase. If there is a capitalized letter in a position other than the start of the string, add one point for that phrase. A maximum of one point will be added for each phrase.
The LDP for each phrase should be summed to form the total LDP for this step.

Step 5: Mixed character strings
If a phrase has 3 or more characters and has any strings of characters that contain numbers and letters mixed together (following the pattern L(N*)L or N(L*)N), add 1 to the LDP.

Step 6: Pronounceable character sequence
If a given phrase has a sequence of characters with a pronounceable character sequence (described in the Determining the Degree of Pronounceability for a generated character sequence document), subtract 1 point from the LDP.

