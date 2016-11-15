
	/* ============================================ INP(UT P)RICE ============================================ *\

		plugin that set an input to be ble to receive (only) a money value.
		
		USE -
			to use it, considering the following html :
			<input type="text" value="0,00" id="foo">

			var inprice = $("#foo").inPrice({
				valMin	: 0,
				valMax	: 999
			});
			-or-
			var inprice = $("#foo").inPrice();
			list of available methods
			inPrice.focus();		// put the focus on it & prepare the traitement
			inPrice.getMinValue();		// get the minimal authorised value
			inPrice.getMaxValue();		// get the maximal authorised value
			inPrice.setMinValue(0,00);	// set a new maximal value for the input
			inPrice.setMaxValue(3,00);	// set a new maximal value for the input
			inPrice.setVal(3,00);		// equivallent of the jQuery $("#foo").val(3,00) but with all the controls on the entry
			
		
		CREDIT -
			Sebastien Pipet (https://www.facebook.com/sebastien.pipet)
		VERSION -
			0.1
		DOWNLOAD -
			https://github.com/fenix92/inprice
		DISCLAIMER -
			All this code is free : you can use, redistribute and/or modify it without any consentement.
			Please just leave my name on it ;-)
		DEFAULT VALUES -
			you can customise the defaults values below :

	/* ========================================= DEFAULT VALUES ============================================ */

	var	maxPrice = 999;				// maximal authorised price
	var	minPrice = 0;				// minimal authorised price
	var	listeSeparators = [];			// list of the separators.
	// below are the authorised separators : the char + the keyCode associated. CAN'T BE MINUS " - ". Note also that order matter : only the firt one will be displayed.
	listeSeparators.push([',',44]);
	listeSeparators.push(['.',46]);
	listeSeparators.push([' ',32]);

	/* =================================================================================================== */

(function ( $ ) {

	// loading all occurs of the plugin into an object
	var listinPrice = {};

	$.fn.inPrice = function(params) {
		// if multiple elements, we split them. Only once they are "alone", we keep doing further
		if (this.length > 1){
			this.each(function() { $(this).inPrice(params) });
			return this;
		}


		// ================= PRIVATE PROPERTIES =================


		var inPrice = this;

		// customizable parameters available, with the default values
		params = $.extend({
			valMax	: maxPrice,
			valMin	: minPrice,
                        separator : listeSeparators
		}, params);

		var	focusOnLeft	 = false,
			focusOnRight	 = false,
			valMaximal	 = params.valMax,
			valMinimal	 = params.valMin,
			separator	 = params.separator,
			currentValue	 = '0'+separator[0][0]+"00",	// default value
			isNegatif	 = false,
			selPosIn	 = 0,				// beginning of the selection (cursor)
			selPosOut	 = 0,				// end of the selection (cursor)
			inputHasFocus	 = false,
//			ctrlHold	 = false,			// detect a ctrl + v/p/x
			iname;						// name of the (unique) class of the item (= ID)


		// ================= PUBLIC PROPERTIES =================


		inPrice.credit = 'sebastien pipet';


		// ================= PRIVATE FUNCTIONS =================


		// init the plugin : instanciation
		var IP_intialize = function() {
			// we create a custom ID (wich is actually a (unique) class)
			counter = IP_countItems();
			iname = "inPrice_input_"+counter;
			inPrice.addClass(iname)

			// the plugin HAS TO BE used on input (of text type). We first check it.
			if(! $("."+iname).is('input:text') ){
				console.log("inPrice plugin : fail, it has to be used on a input of type text.");
				return false;
			}else{
				// we store the element into the inPriceList
				listinPrice[counter] = inPrice;

				// the value of it HAS TO BE -?[0-9]+,[0-9]{2}
				IP_setValue(IP_checkValue());

				return inPrice;
			}
		};

		// check if the value is syntaxicaly correct, and return it (without the minus sign)
		var IP_checkValue = function() {
			var currentValue = $('.'+iname).val();
			// if we accept different separators, we replace all of them by the first one
			if(separator.length>1){
				for(var i=1; i<separator.length; i++){
					currentValue = IP_replaceAll(currentValue,separator[i][0],separator[0][0]);
				}
			}
			// we check if there are any sign " - "
			if(currentValue.indexOf("-") >= 0){
				isNegatif = true;
				currentValue = currentValue.replace('-','');
			}else{
				isNegatif = false;
			}
			var split = currentValue.split(separator[0][0]);
			var currentValueTemp = (isNaN(parseInt(split[0],10))?'0':parseInt(split[0],10))+separator[0][0];
			if(split.length > 1){
				// we have something "on the right"
				var currentValueRightTemp = (isNaN(parseFloat(split[1],10))?0:(parseFloat(split[1],10)));
				// we check is there are any zeros...
				var nbrZ = 0;
				for(var i=0;i<split[1].toString().length;i++){
					if(split[1][i]==0){
						nbrZ++;
					}else{
						break;
					}
				}
				// so we can give the decimal value
				currentValueTemp += IP_sprintf(Math.round(currentValueRightTemp / Math.pow(10,(Math.max(nbrZ,split[1].toString().length-1)-1))),2,true);
			}else{
				// nothing "on the right", we add it
				currentValueTemp = currentValueTemp+"00";
			}
			return currentValueTemp;
		};
		// get the value left/right from a input (position of the numeric value ralative to the separator)
		var IP_getValue = function(isLeft) {
			var v = IP_checkValue();
			var sv = v.split(separator[0][0]);
			if(isLeft){
				return ''+sv[0].replace('-','');
			}
			return ''+sv[1];
		};
		// function that counts the number of items (for old browsers)
		var IP_countItems = function() {
			var count = 0;
			for (var i in listinPrice) {
				if (listinPrice.hasOwnProperty(i)) {
					count++;
				}
			}
			return count;
		};
		// fuction replace for all occurences of a string
		var IP_replaceAll = function(string, find, replace) {
			function escapeRegExp(string) {
				return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
			}
			return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
		};
		// function that show an int with a minimum numbers of digit. the b defines if the 0 comes before (true), or after (false)
		var IP_sprintf = function(i, n, b) {
			var output = i + '';
			while (output.length < n) {
				if(b){
					output = '0' + output;
				}else{
					output = output + '0';
				}
			}
			return output;
		};
		// write on the input the value, with or without the - sign, and compare to the max/min possible value
		var IP_setValue = function(string){
			var	n = parseFloat((isNegatif?'-':'')+string.replace(separator[0][0],'.')),
				changes = false;
			if(n<valMinimal){
				n=valMinimal;
				changes = true;
			}
			if(n>valMaximal){
				n=valMaximal;
				changes = true;
			}
			if(changes){
				$("."+iname).val(n);
				IP_setValue(IP_checkValue());
			}else{
				$("."+iname).val((isNegatif?'-':'')+string);
			}
		}


		// ================= PUBLIC FUNCTIONS =================


		// when the input get the focus,...
		inPrice.focus(function() {
			if(!inputHasFocus){
				inputHasFocus = true;
			}
		});
		// equivalent ot the jQuery .val() function
		inPrice.setVal = function(v){
			inPrice.val(v);
			IP_setValue(IP_checkValue());
		};
		// when the input lost the focus,...
		inPrice.blur(function() {
			inputHasFocus = false;
			selPosIn = 0;
			selPosOut = 0;
			IP_setValue(IP_checkValue());
		});
		// we deal with the direct entries
		inPrice.keypress(function(event){
			event = event || window.event;
			var charCode = (event.keyCode ? event.keyCode : event.which);
			if(	charCode==8	/* backspace/del*/
			||	charCode==9	/* tab		*/
			||	charCode==13	/* enter	*/
			||	charCode==16	/* shift	*/
			||	charCode==37	/* arrow left	*/
			||	charCode==38	/* arrow up	*/
			||	charCode==39	/* arrow right	*/
			||	charCode==40	/* arrow down	*/
			||	charCode==27	/* esc		*/ ){
				// all the keys listed up has normal comportement
				return true;
			}else{
				// first step : we get the cursor position
				var addonCur	= (isNegatif?1:0);			// in case of a negative sign, we increment the cursor position
				selPosIn	= event.target.selectionStart-addonCur;
				selPosOut	= event.target.selectionEnd-addonCur;
				// we target the current input
				var	input	= document.getElementsByClassName(iname),
					key	= event.key || String.fromCharCode(charCode);
				// we prepare the new value with the upcoming char
				var	l	= IP_getValue(true),
					r	= IP_getValue(false),
					currentValueTemp ='';
				currentValue	= IP_checkValue();
				// console.log('l ('+l+') r ('+r+') ; in ('+selPosIn+') out ('+selPosOut+')');

				// ========== AUTHORIZED CHARS : numbers ========== 
				if(	(charCode >= 48 && charCode <= 57)	){	// numbers.
					if(selPosIn<=l.length){
						// we are dealing with the units (=left).
						if(selPosOut>l.length){
							// but with cents/decimals involved (due to a selection of more than one char)
							if(selPosOut-1==l.length){
								// only the comma involved (from the decimals), we assume it's a user mistake into the selection
								for(var i=0; i<selPosIn; i++){
									currentValueTemp = currentValueTemp+currentValue[i];
								}
								currentValueTemp = currentValueTemp+key+separator[0][0]+r;
								IP_setValue(currentValueTemp);
								var sl = parseInt(l.length,10)-(selPosOut-selPosIn)+2+addonCur;
								input[0].setSelectionRange(sl,sl);
								return false;
							}else{
								// cents/decimals involved also
								if(selPosOut==l.length+r.length){
									// one digit is not selected. user mistake ? we leave it anyway (and pass it from decimal to unit)
									for(var i=0; i<selPosIn; i++){
										currentValueTemp = currentValueTemp+currentValue[i];
									}
									currentValueTemp = currentValueTemp+key+r[1]+separator[0][0]+'00';
									IP_setValue(currentValueTemp);
									var sl = selPosIn+3+addonCur;
									input[0].setSelectionRange(sl,sl+2);
									return false;
								}else{
									// all the decimals have been selected. They are cleared.
									for(var i=0; i<selPosIn; i++){
										currentValueTemp = currentValueTemp+currentValue[i];
									}
									//currentValueTemp = currentValueTemp+key+separator[0][0]+'00';
									IP_setValue(currentValueTemp);
									var sl = selPosIn+2+addonCur;
									input[0].setSelectionRange(sl,sl+2);
									return true;
								}
							}
						}else{
							// normal behavior
							if(selPosIn==selPosOut && selPosIn == -1){
								// in this special case, we wrote a number BEFORE the negative sign. we "reset" the value
								IP_setValue(key+currentValue);
								input[0].setSelectionRange(2, 2);
								return false;
							}
							// else, acting normally
							return true;
						}
					}else{
						// we are dealing with the cents/decimals (=right), it can be only 2 numbers
						if(selPosIn==(l.length+1)){
							// the first char of the cents is involved
							if(selPosOut>selPosIn){
								// .. and he is selected
								currentValueTemp = l+separator[0][0]+key+r[1];
								IP_setValue(currentValueTemp);
								// set a select on the last one
								var sl = selPosOut+addonCur;
								input[0].setSelectionRange(sl, sl+1);
								return false;
							}else{
								// only the first
								currentValueTemp = l+separator[0][0]+key+IP_getValue(false)[1];
								IP_setValue(currentValueTemp);
								var sl = selPosIn+1+addonCur;
								input[0].setSelectionRange(sl, sl+1);
								return false;
							}
						}else{
							// the second char of the cents is involved
							currentValueTemp = l+separator[0][0]+IP_getValue(false)[0]+key;
							IP_setValue(currentValueTemp);
							return false;
						}
					}
					return true;
				// ========== AUTHORIZED CHARS : minus/negative sign ========== 
				}else if(charCode == 45){
					// we just switch the sign, doesn't matter the position of the cursor
					isNegatif=!isNegatif;
					IP_setValue(currentValue);
					return false;
				// ========== AUTHORIZED CHARS : separator char(s) ========== 
				}else{
					for(var i=0; i<separator.length; i++){
						if(separator[i][1]==charCode){
							// yes it seems to be one !
							if(selPosIn<l.length){
								// we have now 2 separators. The new one is "on the left" of the current one, as result we clear all the decimals
								for(var i=0; i<selPosIn; i++){
									currentValueTemp = currentValueTemp+l[i];
								}
								// if the separator is not displayed yet, we have to increment sl
								if($('.'+iname).val().indexOf(separator[0][0]) == -1){
									sl+=1;
								}
								var sl = ((currentValueTemp=='')?1:selPosOut)+addonCur+1;
								currentValueTemp = ((currentValueTemp=='')?'0':currentValueTemp)+separator[0][0]+'00';
								IP_setValue(currentValueTemp);
								input[0].setSelectionRange(sl,sl+2);
								return false;
							}else{
								// is there a separator displayed in the input or not yet ?
								if($('.'+iname).val().indexOf(separator[0][0]) == -1){
									// nothing yet, we accept to add one
									var sl = ((currentValueTemp=='')?1:l.length)+addonCur+1;
									currentValueTemp = l+separator[0][0]+'00';
									IP_setValue(currentValueTemp);
									input[0].setSelectionRange(sl,sl+2);
									return false;
								}else{
									// we are in the case where the user ask to plae a new separator "on the right"  or "instead" of the current one,
									// we take it as a user mistake, we ignore it
									return false;
								}
							}
							return true;
						}
					}
				}
			}
			return false;
		});
		// get the min authorised value for the input
		inPrice.getMinValue = function() {
			return valMinimal;
		};
		// get the max authorised value for the input
		inPrice.getMaxValue = function() {
			return valMaximal;
		};
		// set a new the min authorised value for the input
		inPrice.setMinValue = function(newVal) {
			if(!isNaN(parseFloat(newVal)) && isFinite(newVal)){
				if(newVal<=valMaximal){
					valMinimal = newVal;
					IP_setValue(IP_checkValue());
					return true;
				}else{
					// the new minimal value is higher than the maximal value
					console.log("inPrice plugin : fail into set new minimal value : the new value ("+newVal+") has to be lower than the maximal existing one ("+valMaximal+")");
					return false;
				}
			}else{
				// value incorect (float expected)
				return false;
			}
		};
		// set a new the min authorised value for the input
		inPrice.setMaxValue = function(newVal) {
			if(!isNaN(parseFloat(newVal)) && isFinite(newVal)){
				if(newVal>=valMinimal){
					valMaximal = newVal;
					IP_setValue(IP_checkValue());
					return true;
				}else{
					// the new maximal value is lower than the minimal value
					console.log("inPrice plugin : fail into set new maximal value : the new value ("+newVal+") has to be higher than the minimal existing one ("+valMinimal+")");
					return false;
				}
			}else{
				// value incorect (float expected)
				return false;
			}
		};

		return IP_intialize();
	}
}( jQuery ));


 // ]]>
