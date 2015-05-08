// Load in data file
d3.csv(vizFilename,
        function(d) {
          return {
            // assign CSV data to D3 data counterpart
            // Passwords
            originalPassword: d.originalPassword,
            permutedPassword: d.permutedPassword,

            // LPD steps and total
            symbolStart: +d.symbolStart,
            chunks: +d.chunks,
            characters: +d.characters,
            unsentenceLikeCaps: +d.unsentenceLikeCaps,
            mixedCharacterString: +d.mixedCharacterString,
            pronounceable: +d.pronounceable,
            lpd: +d.lpd,

            // Permuted LPD steps
            newlpd: +d.newlpd,
            newpronounceable: +d.newpronounceable,
            newmixedCharacterString: +d.newmixedCharacterString,
            newunsentenceLikeCaps: +d.newunsentenceLikeCaps,
            newcharacters: +d.newcharacters,
            newchunks: +d.newchunks,
            newsymbolStart: +d.newsymbolStart,

            // Keystrokes
            desktopkeystrokes: +d.desktopkeystrokes,
            androidkeystrokes: +d.androidkeystrokes,
            ipadkeystrokes: +d.ipadkeystrokes,
            newipadkeystrokes: +d.newipadkeystrokes,
            newandroidkeystrokes: +d.newandroidkeystrokes,
            newdesktopkeystrokes: +d.newdesktopkeystrokes,

            // Entropy
            entropy: +d.entropy,
            newentropy: +d.newentropy,
            lostentropy: +d.lostentropy,
            percententropyLoss: +d.percententropyLoss,

            // Other metrics
            passwordlength: +d.passwordlength,
            numLetters: +d.numLetters,
            numNumbers: +d.numNumbers,
            numSymbols: +d.numSymbols
          };
        }, //Function to run once data is loaded
        function(error, data) {
          console.log(data); //print data object to the console
          
          // Default sorting for passwords 
          data.sort(comparenewentropy);

          newData = data;
          updatedData = data;
          originalData = data;

          drawGrid(originalData, gridType);
          loadChangeData();
  });

function loadChangeData() {
      d3.csv("catCode-results-1thousand-2015-01-15-change.csv",
              function(d) {
                return {
                  originalPassword: d.originalPassword,
                  symbolStart: +d.symbolStart,
                  chunks: +d.chunks,
                  characters: +d.characters,
                  unsentenceLikeCaps: +d.unsentenceLikeCaps,
                  mixedCharacterString: +d.mixedCharacterString,
                  pronounceable: +d.pronounceable,
                  lpd: +d.lpd,

                  desktopkeystrokes: +d.desktopkeystrokes,
                  androidkeystrokes: +d.androidkeystrokes,
                  ipadkeystrokes: +d.ipadkeystrokes,
                  entropy: +d.entropy,
                  newentropy: +d.newentropy,
                  newipadkeystrokes: +d.newipadkeystrokes,
                  newandroidkeystrokes: +d.newandroidkeystrokes,
                  newdesktopkeystrokes: +d.newdesktopkeystrokes,
                  
                  newlpd: +d.newlpd,
                  newpronounceable: +d.newpronounceable,
                  newmixedCharacterString: +d.newmixedCharacterString,
                  newunsentenceLikeCaps: +d.newunsentenceLikeCaps,
                  newcharacters: +d.newcharacters,
                  newchunks: +d.newchunks,
                  newsymbolStart: +d.newsymbolStart,
                  lostentropy: +d.lostentropy,
                  percententropyLoss: +d.percententropyLoss,
                  permutedPassword: d.permutedPassword,

                  passwordlength: +d.passwordlength,
                  numLetters: +d.numLetters,
                  numNumbers: +d.numNumbers,
                  numSymbols: +d.numSymbols

                };
              }, //Function to run once data is loaded
              function(error, data) {
                // console.log(data); //print data to the console
                
                data.sort(comparenewentropy);

                changeData = data;
                // newData = data;
                // gridType = "changedata";
                // drawGrid(changeData, gridType);
        });
  }

// When document is ready, set up GUI triggered events
$(document).ready(function(){
    
    // svgsidebarelement = document.getElementById('chartsvg');  
    guievents();            
});