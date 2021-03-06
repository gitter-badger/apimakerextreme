function fourdigits(number)  {
   return (number < 1000) ? number + 1900 : number;
}

function HTMLEdit(sys, formID, code, posX, posY, width, height, description, value) {
  this.create(sys, formID, code, posX, posY, width, height, description, value);
  this.tagName = 'edit';
  this.type = 1;
  this.month = this.actualMonth + 1;
  this.realMonth = this.actualMonth;
  this.year = this.actualYear;
  this.name = 'HTMLEdit';
  this.tabable = true;
  this.maskSuport = true;
  this.report = false;
}

HTMLEdit.inherits(HTMLLabeledComponent);

HTMLEdit.prototype.now = new Date();
HTMLEdit.prototype.actualMonth = HTMLEdit.prototype.now.getMonth();
HTMLEdit.prototype.actualYear = fourdigits(HTMLEdit.prototype.now.getYear());
HTMLEdit.prototype.canCheckRegularExpression = true;

HTMLEdit.prototype.getValue = function() {
  var value = this.input.value;
  if (this.textMask) {
    if (this.textMask == "U>") {
      value = value.toUpperCase();
    } else if (this.textMask == "l>") {
      value = value.toLowerCase();
    }
  }
  return value;
};

HTMLEdit.prototype.setWidth = function(width) {
  width = parseInt(width);
  this.callMethod(HTMLLabeledComponent, 'setWidth', [width]);
  var x = this.width+1;
  if (this.toGrid) x = this.width - 17;
  if (this.btdiv) this.btdiv.style.left = x + "px";
};

HTMLEdit.prototype.setType = function(type) {
  this.type = type;
  if (this.btdiv) {
    this.context.removeChild(this.btdiv);
  this.btdiv = null;
  this.img = null;
  }
};

HTMLEdit.prototype.setMonth = function(m) {
  this.month = m + 1;
  this.realMonth = m;
};

HTMLEdit.prototype.setYear = function(y) {
  this.year = y;
};

HTMLEdit.prototype.designInput = function(doc, name, value) {
  var edtType = 'text';
  if (this.password)
    edtType = 'password';

  this.input = document.createElement("input");
  this.input.type = edtType;
  
  if (this.placeholder) {
    this.input.placeholder = this.placeholder;
  }

  if (this.placeholder) {
    this.input.placeholder = this.placeholder;
  }

  if (this.autocomplete) {
    this.input.autocomplete = "on";
  } else {
    this.input.autocomplete = "off";
  }

  if (!name)
    this.input.name  = 'WFRInput'+this.code;
  else
    this.input.name  = name;

  if (this.maxlength) this.input.maxLength = this.maxlength;
  this.input.style.height = this.height + "px";
  this.input.style.width = this.width + "px";
  if (this.align) this.input.style.textAlign = this.align;
  if (!value)
    this.input.value = this.value;
  else
    this.input.value = value;
};

HTMLEdit.prototype.designReport = function() {
  var labelReport = new HTMLLabel(this.sys, this.formID, this.code, 0, 0, this.width, this.height, this.value);
  labelReport.id  = "ReportLabel" + this.code;
  labelReport.design(this.context, false);
};

HTMLEdit.prototype.designComponent = function(doc) {
	//MEx: Cria propriedades do DatePiker
		this.dateProperties = {
            showOn: "button",
            buttonImage: skin + this.name + '/date.gif',
            buttonImageOnly: true,
			dateFormat: "dd/mm/yy",
			dayNamesMin: [ "D", "S", "T", "Q", "Q", "S", "S" ],
			changeMonth: true,
            changeYear: true,
			//Ranger de anos que aparece no Componente
			yearRange: '1900:2050',			
			monthNamesShort: [ "Janeiro", "Fevereiro", "Mar�o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
			//Altera��o para abrir para cima no FF
			beforeShow: function(input, inst){				
				if(navigator.userAgent.indexOf('Firefox')!=-1){
					
					if($MEx(input).offset().top>220){
						inst.dpDiv.css({marginTop: -(input.offsetHeight+200) + 'px', marginLeft:'0px'});
					}else{
						inst.dpDiv.css({marginTop:'2px', marginLeft:'0px'});
					}
				}
			}
		}
	
	
  if (this.beforeComponentDesign) {
    this.beforeComponentDesign(doc);
  }

  // Testa se � relat�rio
  if (this.report) {
    this.designReport();
    return "";
  }

  this.designInput(doc);
  this.context.appendChild(this.input);

  if (this.type == 2) {  
  	// MEx: Coloca cria o DatePiker		
	$MEx(this.input).datepicker(this.dateProperties);
  
    var img = new ImageObject();
    var x = this.width+1;
    if (this.toGrid) x = this.width - 17;
    this.btdiv = this.getDiv('WFRComponentDate'+this.code, x, ((this.height/2)-8)+(IE?1:0), 16, 16, 1, true);
    this.img = img.getImage(skin + this.name + '/date.gif', '', this.getAction('openDate'));
    this.onF5press = this.getAction('openDate');
   
	 //MEx: Coloca a imagem dentro da div padr�o do maker
	var imgMex = $MEx(this.div).find(".ui-datepicker-trigger");	
	$MEx(imgMex).clone("withDataAndEvents","true").appendTo(this.btdiv);
	$MEx(imgMex).remove();
	

    if (!this.enabled && this.readonly) {
	//MEx: Remove o DataPiker Caso leitura ou desabilitado
      $MEx(this.input).datepicker("destroy");
    }	
  }
  
  this.setEnabled(this.enabled);
  
  if (!isNullable(this.regularExpression)) {
    var x = this.width+1+(this.type == 2 ? 16 : 0);
    if (this.toGrid) x = this.width - 17;
    this.validateDataDiv = this.getDiv('ValidatedDataDiv'+this.code, x, ((this.height/2)-8)+(IE?1:0), 16, 16, 1, false);
    
    this.validatedDataImage = new ImageObject().getImage(skin + "wrong.png", getLocaleMessage("ERROR.INVALID_FIELD_CONTENT", this.getDescription()));
    this.validateDataDiv.appendChild(this.validatedDataImage);
    
    this.context.appendChild(this.validateDataDiv);
  }
  
  if (this.afterComponentDesign) {
    this.afterComponentDesign(doc);
  }
};

HTMLEdit.prototype.setValidatedData = function(validated) {
  validated = !!validated;
  this.regularExpressionValidated = validated;
  
  var value = this.getValue();
  visibleDiv(this.validateDataDiv, (value != null && value.length > 0 && !validated));
};

HTMLEdit.prototype.setReadOnly = function(v) {
  this.callMethod(HTMLElementBase, 'setReadOnly', [v]);
  if (this.btdiv) visibleDiv(this.btdiv, !this.readonly);
};

HTMLEdit.prototype.setEnabled = function(v) {
  this.enabled = v;
  if (!this.enabled) {
    if (containsNode(this.context, this.btdiv)) {
      this.context.removeChild(this.btdiv);
    }
  } else {
    if (this.type == 2 && !containsNode(this.context, this.btdiv)) {
      this.context.appendChild(this.btdiv);
    }
  }
  this.input.disabled = !v;
};

HTMLEdit.prototype.openDate = function() {
  if (!this.readonly && this.enabled) {
    if (typeof(isPopup) != "undefined" && !isPopup) {
      var documentDimensions = getDocumentDimensions($mainform().document);
      var left = (documentDimensions.width - 240)/2;
      var top = (documentDimensions.height - 150)/2;
      
      if (this.posX + 240 < documentDimensions.width) {
        left = this.posX;
      } else {
        left = this.posX + this.width - 240;
      }
      
      if (this.posY + this.height + 150 < documentDimensions.height) {
        top = this.posY + this.height;
      } else {
        top = this.posY - 150;
      }
      if (d.n.visible) { //Barra de navega��o
        top += 42;
      }
      if (d.t.visible) { //Abas
        top += 20;
      }
  
      this.dateDiv = document.createElement("div");
      this.dateDiv.className = this.name + "Calendar";
      this.dateDiv.style.left = left + "px";
      this.dateDiv.style.top = top + "px";
      
      var dateFrame = document.createElement("iframe");
      dateFrame.src = "getdate?sys="+this.sys+"&month="+this.realMonth+"&year="+this.year+"&field="+this.input.name;
      
      this.dateDivLock = document.createElement("div");
      this.dateDivLock.className = this.name + "CalendarLock";
      this.attachEvent(this.dateDivLock, 'click', this.closeDate);
      
      $mainform().d.body.appendChild(this.dateDivLock);
      this.dateDiv.appendChild(dateFrame);
      $mainform().d.body.appendChild(this.dateDiv);
    } else {
      var x = tempX;
      var y = tempY+20;
      if (x+250 > screen.width)
        x = screen.width - 260;
      if (y+150 > screen.height-70)
        y = screen.height - 220;
      
      MM_openBrWindow('getdate?sys='+this.sys+'&month='+this.realMonth+'&year='+this.year+'&field='+this.input.name,'WFRDate','toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=250,height=150,top='+y+',left='+x);
    }
  }
};

HTMLEdit.prototype.closeDate = function() {
  $mainform().d.body.removeChild(this.dateDiv);
  $mainform().d.body.removeChild(this.dateDivLock);
};

HTMLEdit.prototype.beforeSubmit = function() {
  if (!this.enabled) {
    this.input.disabled=false;
  }
  if (this.textMask && this.input) {
    if (this.textMask == "U>") {
      this.input.value = this.input.value.toUpperCase();
    } else if (this.textMask == "l>") {
      this.input.value = this.input.value.toLowerCase();
    }
  }
};

HTMLEdit.prototype.afterSubmit = function() {
  if (!this.enabled) {
    this.input.disabled=true;
  }
};