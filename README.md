# Air Pollution Project - Final (Third) Year Individual Project

I verify that I am the sole author of the programs contained in this folder, except where 
explicitly stated to the contrary.
The following files are not my own: leaflet-heatmap.js, and heatmap.js

Mark Mataac, 29 March 2021


Third year individual project focusing on visualisation of mined air quality data 
of London, using heatmaps overlaid on maps, a bar chart, and a line chart. 
The user may select between 5 different pollutants (NO2, PM10, PM2.5, O3, and SO2), 
and dates in the range 1st Jan 1995 and the most recent date with data available 
(this is usually the day before the current day). The first map will always be set 
to this most recent date. The user may choose to display data on the maps and bar 
chart on a daily or monthly basis, while the line chart displays data on an annual 
basis.

This project employs the use of several APIs and plugins:
(1) London Air Quality API: https://www.londonair.org.uk/Londonair/API/
(2) Leaflet API: https://leafletjs.com/
(3) heatmap.js plugin: https://www.patrick-wied.at/static/heatmapjs/
(4) Chart.js API: https://www.chartjs.org/

Note: depending on the validity of the certificate for the LAQ API, the website may 
not work on Chrome. If it does not, Firefox is an alternative option. Other browsers 
may work but they are not necessarily supported, so correct operation cannot be 
guaranteed. 
The website is hosted on: https://github.kcl.ac.uk/pages/k1890280/prjMarkMataac/

If you don't have access to KCL GitHub Enterprise, you may also view the website locally. 
In this case, simply downloading this repository and opening the file 'index.html' in your 
browser should allow you to do this. Again, the website should work on Chrome and Firefox, 
with other browsers not being tested on for support.

Below are .gifs of how the web app works. They are sped up to skip over long waiting times
that are due to internet speed.

Loading in default data (5 most recent data points and NO2):
![APPdefault](https://user-images.githubusercontent.com/47302107/130794050-38f36ed3-68f9-4eb2-af7b-f5d82402a4a9.gif)

Loading in data for specific days and pollutants:
![APPday](https://user-images.githubusercontent.com/47302107/130794026-fa97ff1a-a202-4366-9498-629bd27b95e6.gif)

Loading in data for specific month and pollutant:
![APPmonth](https://user-images.githubusercontent.com/47302107/130794052-adb5b04a-ef40-4b0e-9d15-cdd63f7c5ebd.gif)

Loading in average data over several years:
![APPyear](https://user-images.githubusercontent.com/47302107/130794055-2f670355-8d66-4951-a1c6-c3ac7162c21a.gif)

