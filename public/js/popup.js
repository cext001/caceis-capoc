function showDetailPopup(popupDivName, popupTitle, idPlan){
	$.ajaxSetup({cache:false});
	$('#' + popupDivName).empty();
	$('#' + popupDivName).load('tiles.stockoptions.DetailPlanNew.input.action', {"idPlan":idPlan})
    .dialog({
    	autoOpen: false,
        title : popupTitle,
        modal: true, 
        resizable : false,
        draggable: false,
        width:'700px'
      }).dialog('open');    
}

function showHistoriquePopup(popupDivName,popupTitle, idDemande){
	$.ajaxSetup({cache:false});
	$('#' + popupDivName).empty();
	$('#' + popupDivName).load('tiles.stockoptions.HistoriqueDemandeNew.input.action', {"idDemande":idDemande})
    .dialog({
    	autoOpen: false,
        title : popupTitle,
        modal: true, 
        resizable : false,
        draggable: false,
        width:'500px'
      }).dialog('open');  
	
}

function showPagaPopup(popupDivName, popupTitle, idPlan, from){
	$.ajaxSetup({cache:false});
	$('#' + popupDivName).empty();
	$('#' + popupDivName).load('paga.DetailPaga.init.action', {"idPaga":idPlan, "from":from})
    .dialog({
    	autoOpen: false,
        title : popupTitle,
        modal: true, 
        resizable : false,
        draggable: false,
        width:'700px'
      }).dialog('open');    
}

function showTransfertPagaPopup(popupDivName, popupTitle, idOperation){
	$.ajaxSetup({cache:false});
	$('#' + popupDivName).empty();
	$('#' + popupDivName).load('transfertPaga.popupRecap.action', {"cIdOperation":idOperation})
    .dialog({
    	autoOpen: false,
        title : popupTitle,
        modal: true, 
        resizable : false,
        draggable: false,
        width:'700px'
      }).dialog('open');
}

function showBilanDemandePopup(idDemandeSelected,numDemande){
	window.open('edition.BilanDemande.editPdf.action?idDemandeSelected='+idDemandeSelected+'&numDemande='+numDemande,"_blank","titlebar=no,directories=no,location=no,menubar=no,status=no,scrollbars=no,width=750,height=500,resizable=yes");
}

function showHistoCourPopup(popupDivName, popupTitle, valeIden) {
	$.ajaxSetup({cache:false});
	$('#' + popupDivName).empty();
	$('#' + popupDivName).load('tiles.avoirs.HistoCourAction.input.action', {"valeIden":valeIden})
	.dialog({
    	autoOpen: false,
        modal: true,
        draggable: false,
        resizable : false,
        title : popupTitle,
        width:'700px'
      }).dialog('open');    
}

function showPopupAnnulation(popupName){
	$.ajaxSetup({cache:false});
	$('#' + popupName).empty();
	$('#' + popupName).load('JSP/operation/AnnulationPopup.jsp')
	.dialog({
    	autoOpen: false,
        modal: true,
        draggable: false,
        resizable : false,
        title : '',
        width:'700px'
      }).dialog('open');   
}
function showPopupHorsDelai(popupName, popupTitle, typeOst){
	$.ajaxSetup({cache:false});
	$('#' + popupName).empty();
	$('#' + popupName).load('operation.showHorsDelaiPopup.action', {"typeOst":typeOst})
	.dialog({
    	autoOpen: false,
        modal: true,
        draggable: false,
        resizable : false,
        title : popupTitle,
        width:'700px'
      }).dialog('open');   
}
function showPopupValidee(popupName){
	$.ajaxSetup({cache:false});
	$('#' + popupName).empty();
	$('#' + popupName).load('JSP/operation/ValideePopup.jsp')
	.dialog({
    	autoOpen: false,
        modal: true,
        draggable: false,
        resizable : false,
        title : '',
        width:'700px'
      }).dialog('open');   
}

function errorMessageDialog(titre, message){
	$( "#layout-popup").text(message)
	.dialog({
		autoOpen: false,
        modal: true,
        draggable: false,
        resizable : false,
        title: titre,
        buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
}
