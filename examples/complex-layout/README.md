# Complex Page Layout Example
Layout principle is to nest rows in columns, columns in rows and tabs within.

Result layout:

	  ----------------------------
	  |  Row 1 View              |
	  ----------------------------
	  |  Row 2 View              |
	  ----------------------------
	  |  Row 3 with 2 columns    |
	  | ---------  ------------- |
	  | |       |  |   Col 2   | |
	  | | Col 1 |  | --------- | |
	  | | View  |  | | Row X | | |
	  | |       |  | --------- | |
	  | |       |  | | Row X | | |
	  | |       |  | --------- | |
	  | ---------  ------------- |
	  ----------------------------
	  |    row4view              |
	  |  /tab21\ /tab22\ /tab23\ |
	  |                          |
	  ----------------------------
 
# Run example
1. You need to [get a local copy of the easy-web gui](https://github.com/ma-ha/easy-web-gui).
2. in this directory simply run: `nodejs index.js` 
3. New feature since 2.9.0: Pre-select Tabvb on Page load, e.g. open  http://localhost:8888/index.html?row4view=tab23