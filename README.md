# jQuery-inPrice (= INput + pRICE)

**jQuery** plugin that force an input (type text) to receive a CURRENCY value **-123,45** (example). Nothing else. Easy to use, and user-friendly. Simply fill the form with whatever, and the pluggin controls it. It's not only about authorising only the numbers, it's also about controling the selections, etc. And never forget to always double-check the value on server-side ;)

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

1 - you can press the minus sign ( - ) wherever is your cursor, he will be added (or removed) on the beginning of your number. If the minimum setted value allows it of course.

2 - because of countries, the separator between the integers and the decimals may change. Sometimes it's a dot ( . ), sometimes a comma ( , ), ... This pluggin allows the user to use many differents ones. Check on the js file the "DEFAULT VALUES" :

    listeSeparators.push([',',44]);
    listeSeparators.push(['.',46]);
    listeSeparators.push([' ',32]);

Theses lines allows the comma, the dot and the space as separators (have to be **single** character). However, whatever the user entrer, only the first one will be displayed. The numerical value is the keyCode associated. If you want to add any separator, this link will heal you to find the keyCode ;) http://www.asquare.net/javascript/tests/KeyCode.html

3 - The plugin is dealing with the text of the input. You can't write letters. Only numbers, thes separator(s) and the minus sign.


### Ideas of upgrade :

 - make easier the add of separators (but ... i don't need others...).

Any comments or suggestions are welcome !
Cheers
