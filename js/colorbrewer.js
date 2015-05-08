// Holds color values for different scales
var colorbrewer = {
    Greys: {
        3: ["#f0f0f0","#bdbdbd","#636363"],
        4: ["#f7f7f7","#cccccc","#969696","#525252"],
        5: ["#f7f7f7","#cccccc","#969696","#636363","#252525"],
        6: ["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#636363","#252525"],
        7: ["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],
        8: ["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],
        9: ["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"]},
    GnYlRd: {
        9: ["#081d58","#225ea8", "#41b6c4", "#c7e9b4","#ffffd9", "#ffeda0","#feb24c","#fc4e2a","#bd0026"],
        18: ["#081d58", "#253494","#225ea8", "#1d91c0", "#41b6c4", "#7fcdbb", "#c7e9b4","#edf8b1","#ffffd9", "#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]},
    YlGnBu: {
        3: ["#edf8b1","#7fcdbb","#2c7fb8"],
        4: ["#ffffcc","#a1dab4","#41b6c4","#225ea8"],
        5: ["#ffffcc","#a1dab4","#41b6c4","#2c7fb8","#253494"],
        6: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],
        7: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],
        8: ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],
        9: ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]}, 
    PuRd: {
        3: ["#e7e1ef","#c994c7","#dd1c77"],
        4: ["#f1eef6","#d7b5d8","#df65b0","#ce1256"],
        5: ["#f1eef6","#d7b5d8","#df65b0","#dd1c77","#980043"],
        6: ["#f1eef6","#d4b9da","#c994c7","#df65b0","#dd1c77","#980043"],
        7: ["#f1eef6","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],
        8: ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],
        9: ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]}, 
    BlWt: {
        9: ["#08306b","#08519c","#2171b5","#4292c6","#6baed6","#9ecae1","#c6dbef","#deebf7","#f7fbff"]},
    WtRd: {
        9: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]},
    WtBl: {
        9: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]}
    };