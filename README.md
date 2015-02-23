# The Authentication Equation
_A tool for visualizing the convergence of usability and security in text-based passwords_

## About this code
This code comprises of a data visualization tool to explore password usability and security metrics. The visualization tool integrates various measurements of passwords, enabling exploration of the intersection of their usability and security components. The tool is based on insight from previously gathered data from usability studies conducted at the United States National Institute of Standards and Technology. It also leverages web technologies to flexibly display data sets computed from sets of passwords.

## What this tool doesn't do

- _Compare different data sets._ The tool calculates the mapping of values to color scales based on the one data set it is handling at a time. This means color values map differently with every dataset. The resulting visuals for datasets should not be compared side by side.

- _Visualize human generated sets of passwords._ Due to the way in which entropy is calculated, this tool is only meant to visualize system generated passwords (randomly generated). The tool does not currently implement methods of measuring human generated sets of passwords. 

## How visualize a set of passwords

_Note: Sample files are provided in the input and output folders of the tool for your reference._

### A. What you'll need:
- A .txt file list of the passwords to be visualized. For example (newline separated):
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
- Python 3. Note that the code will not run properly earlier versions (Python 2, etc.). 
  - If you don't have Python installed, [download it here](https://www.python.org/downloads/). 
- Chrome browser (updated).
  - [Download Chrome here.](https://www.google.com/chrome/browser/desktop/)
- Code/text editor (Sublime 2 works well and is free).
  - [Download Sublime 2 here](http://www.sublimetext.com/2)


### B. Create your dataset

1. Move your list of passwords (.txt file) to `DataVis/input/`. 
2. Open `DataVis/USG.py` in a code/text editor. 
3. Scroll to line 63, type in the filename of your list of passwords, and save the file:
```
################ Change input file here #######################
# Open file with passwords stored
i = open('input/example.txt', 'r')
```
4. Open the Command Line (PC) or Terminal (Mac). 
5. Navigate (using the `cd` command) to the folder in which `USG.py` is contained (`DataVis/`).
6. Run `USG.py` using the command `Python3 USG.py`
7. Enter a filename for the new dataset to be created when the program prompts you:
```
Enter the name of the output file: 
```
8. The new dataset should now appear in the `DataVis/output` folder. 


### C. Visualize your dataset

1. Open `output/js/init.js` and type in the name of the `.csv` file just generated (or any .csv file generated into the `output` folder you would like to visualize). 
2. If you are able to host this code on a server, you can open `output/password-visualization.html` to run the visualization. However, you can also run the code without such an environment by following these instructions: 
  1. Close Chrome if it is open (make sure all background operations of chrome have ceased.
  2. Open Chrome from the Command Line/Terminal:
    
    Mac 
    ```
    $ open /Applications/Google\ Chrome.app --args -allow-file-access-from-files
    ```
    PC

      - cd to where chrome.exe is located before you run this command. The file path is probably similar to `C:\Program Files (x86)\Google\Chrome\Application\`
    
    ```
    >> chrome.exe --allow-file-access-from-files
    ```
  3. Open `output/password-visualization.html` 

## Disclaimer 

“The United States Department of Commerce (DOC) GitHub project code is provided on an ‘as is’ basis and the user assumes responsibility for its use. DOC has relinquished control of the information and no longer has responsibility to protect the integrity, confidentiality, or availability of the information. Any claims against the Department of Commerce stemming from the use of its GitHub project will be governed by all applicable Federal law.Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply their endorsement, recommendation or favoring by the Department of Commerce. The Department of Commerce seal and logo, or the seal and logo of a DOC bureau, shall not be used in any manner to imply endorsement of any commercial product or activity by DOC or the United States Government.”