function showHelpPopup(url) {
	window.open(url,"_blank","titlebar=no,directories=no,location=no,menubar=no,status=no,scrollbars=no,width=750,height=500,resizable=yes");
}

function buildMyError(errors, fieldErrors, defaultErrorMessage) {
	var msg = "<ul>";
	for (var i = 0; i < errors.length; i++) {
		msg += "<li>" + errors[i].err + "</li>";
	}
	for (i = 0; i < fieldErrors.length; i++) {
		for(var j = 0; j < fieldErrors[i].thisFieldErrors.length; j++){
			if(fieldErrors[i].thisFieldErrors[j].err != '{}'){
				msg += "<li>" + fieldErrors[i].thisFieldErrors[j].err + "</li>";
			}
		}
	}
	if(errors.length == 0 && fieldErrors.length == 0) {
		msg += "<li>" + defaultErrorMessage + "</li>";
	}
	msg += "</ul>";

	return msg;
}