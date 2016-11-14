# jQuery-inPrice (= INput + pRICE)

**jQuery** plugin that force an input (type text) to receive a CURRENCY value **-123,45** (example). Nothing else. Easy to setup, and user-friendly. Simply fill the form with whatever value, and the pluggin deals with it. I know some of you may say that I could use this instead :

    <input type="number" step="0.01" /> 

But sadly for me, the cents separator is changing depending on internet browsers (comma vs. point), and... It was a problem for me.
The plugin is intelligently filling the input with the values you give to him. Better than words, give a try : add letters, numbers, comma-separator, etc.

online-example : http://www.clamart-natation.com/inprice/


Please consider the following html :

    <input type="text" value="123,45" id="foo">

To force theses inputs to receive a "price" value, just insert :

    <script type="text/javascript" src="script-inprice.js"></script>
    <script type="text/javascript">
        var inprice1 = $("#foo").inprice();
        // or (with all options)
        var inprice2 = $("#foo").inprice({
                valMin	: 0,
                valMax	: 200
        });
    </script>
for a quick explaination,

    valMin     : the minimal value the user can give. Can be negative value
    valMax     : the maximal value the user can give. Can be negative value

once the plugin is launched, at any moment you can access to this methods :

    inprice1.focus();	        // put the focus on $("#foo1")
    inprice1.getMinValue();	  // return the minimal value the input can get.
    inprice1.getMaxValue(); 	// return the maximal value the input can get.
    inprice1.setMinValue(n);	// set a new minimal possible value. 'n' is a int or float
    inprice1.setMaxValue(n);	// set a new maximal possible value. 'n' is a int or float
    inprice1.setVal(n);     	// even if you always can force the input to get any value
                              // with the function .val(), the pluggin proposes the .setVal()
                              // function who check that the new entry is matching with all the rules.

Note few things :

 - you can press the minus sign ( - ) wherever is your cursor, he will be added (or removed) on the beginning of your number. If the minimum setted value allows it of course.

 - because of countries, the separator between the integers and the decimals may change. Sometimes it's a dot ( . ), sometimes a comma ( , ), ... This pluggin allows the user to use many differents ones. Check below to see how to add some :

In other words, you can add any char as a separator (just can't be number or minus). On the example, we have 3 differents workins (check for "DEFAULT VALUES" on the .js file):

    listeSeparators.push([',',44]);  // set the comma as the "official" separator
    listeSeparators.push(['.',46]);  // set the point as an optional other separator
    listeSeparators.push([' ',32]);  // set the space as an optional other separator

Theses lines allows 3 different separators. Note that they have to be a **single** character, and even if you use secondary ones, only the first will be displayed. To add a separator, you need to add an array with : the character, and his keyCode associated (this link may be useful for any add http://www.asquare.net/javascript/tests/KeyCode.html)

 - The plugin is dealing with the text of the input. You can't write letters. Only numbers, the separator(s) and the minus sign.


### Ideas of upgrade :

 - make easier the add of separators (but ... i don't need others...).
 - use the arrows up/down to increase/decrease the value. Easy to program, but I'm not sure it won't interfer with other things on the page...

Any comments or suggestions are welcome !
Cheers
