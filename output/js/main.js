// Change filenames here to change data for visualization
d3.csv(vizFilename,
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
          
          data.sort(compareentropy);

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
                
                data.sort(compareentropy);

                changeData = data;
                // newData = data;
                // gridType = "changedata";
                // drawGrid(changeData, gridType);
        });
  }

          $(document).ready(function(){
              
              svgsidebarelement = document.getElementById('chartsvg');  
              guievents();            
          });