# The Authentication Equation
A tool for visualizing the convergence of usability and security in text-based passwords

## About this code
This code comprises of a data visualization tool to explore password usability and security metrics. The visualization tool integrates various measurements of passwords, enabling exploration of the intersection of their usability and security components. The tool is based on insight from previously gathered data from usability studies conducted at the United States National Institute of Standards and Technology. It also leverages web technologies to flexibly display data sets computed from sets of passwords.


## How visualize a set of passwords

### A. What you'll need:
1. A .txt file list of the passwords to be visualized. An example (newline separated):
```
{x!_ZZX0
n5Yw;_o@
79IrVyE}
,SJ#c15E
.+1F2Hs/
$oX<D$2R
7:OMx9kL
b>ANoN1i
woP9Uo[=
64#$FOpN
uZ-$q8@)
n]P27{D(
|Vf99LVn
```
2. Python 3. Note that the code will not run properly earlier versions (Python 2, etc.)
3. Chrome browser (updated).
4. Code/text editor (Sublime 2 works well and is free).


### B. Create your dataset

1. Move your list of passwords (.txt file) to the ''input'' folder. 
2. Open `USG.py` in a code/text editor. 
3. Scroll to line 63, type in the filename of your list of passwords, and save the file.
```
################ Change input file here #######################
# Open file with passwords stored
i = open('input/example.txt', 'r')
```
4. Open the Command Line (PC) or Terminal (Mac). 
5. Navigate (using the `cd` command) to the folder in which `USG.py` is contained.
6. Run `USG.py` using the command `Python3 USG.py`
7. The program will prompt you for a filename for the new dataset to be created, then show the calculations of the password metrics as it runs. 
8. The new dataset should now appear in the `output` folder. 


### C. Visualize your dataset

1. Open `output/js/init.js` and type in the name of the `.csv` file just generated (or any .csv file generated into the `output` folder you would like to visualize). 
2. If you are able to host this code on a server, you can open `output\password-visualization.html` to run the visualization. However, you can also run the code without such an environment by following these instructions: 
  1. Close Chrome if it is open (make sure all background operations of chrome have ceased.
  2. Open Chrome from the Command Line/Terminal:
    
    Mac 
    ```
    >> open /Applications/Google\ Chrome.app --args -allow-file-access-from-files
    ```
    PC
    ```
    ## CD to where chrome.exe is located before you run this command.
    ## probably similar to 'C:\Program Files (x86)\Google\Chrome\Application\'
    
    >> chrome.exe --allow-file-access-from-files
    ```
  3. Open `output\password-visualization.html` 

