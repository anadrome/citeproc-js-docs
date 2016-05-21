tinymce.PluginManager.add('citeaddedit', function(editor) {
    
    var citesupport = editor.plugins.citesupport.citesupport;

    function getIDs (citationID) {
        var itemIDs = [];
        var citation;
        for (var i = 0, ilen = citesupport.config.citationByIndex.length; i < ilen; i++) {
            if (citesupport.config.citationByIndex[i].citationID === citationID) {
                citation = citesupport.config.citationByIndex[i];
            }
        }
        // Although citation should ALWAYS exist if document data has cleared validation
        if (citation) {
            itemIDs = citation.citationItems.map(function(obj){
                return obj.id;
            });
        }
        return itemIDs;
    }

    function buildMenu() {
        var menu = [];
        var itemData = [
            {
                title: "Geller 2002",
                id: "item01"
            },
            {
                title: "West 1934",
                id: "item02"
            },
            {
                title: "Allen 1878",
                id: "item03"
            },
            {
                title: "American case",
                id: "item04"
            },
            {
                title: "British case",
                id: "item05"
            }
        ];
        for (var i = 0, ilen = itemData.length; i < ilen; i++) {
            menu.push({
                type: 'checkbox',
                name: itemData[i].id,
                label: ' ',
                text: itemData[i].title,
                value: itemData[i].id
            });
        }
        return menu;
    }

    /*
      function updateValue(e) {
        console.log('XX GOT: '+e.target.name());
        console.log('XX has got citesupport? '+editor.plugins.citesupport);
      }
    */

    function configMenu(menu, itemIDs) {
        for (var i = 0, ilen = itemIDs.length; i < ilen; i++) {
            var itemID = itemIDs[i];
            for (var j = 0, jlen = menu.length; j < jlen; j++) {
                menu[j].checked = true;
            }
        }
        return menu;
    }

	function showDialog() {
		var selectedNode = editor.selection.getNode(), citationID = '';
		var isCitation = selectedNode.tagName == 'SPAN' && editor.dom.hasClass(selectedNode, 'citation');

		if (isCitation) {
			citationID = selectedNode.id || '';
		}
        
        // Okay!
        // So if we're at a citation, we check its ID and look up its itemIDs in
        // the current citationByIndex map. It has to be in there.
        var menu = buildMenu();
        var itemIDs = getIDs(citationID);
        var menu = configMenu(menu, itemIDs);

        // If we're not at a citation, we insert a new one.

		editor.windowManager.open({
			title: 'Add/Edit citation',
			body: menu,
			onsubmit: function(e) {
				if (!isCitation) {
					//editor.selection.collapse(true);
                    //editor.insertContent('<span class="bogus">hello</span>');
					editor.execCommand('mceInsertContent', false, '<span class="citation mceNonEditable">{Citation}</span>');
				}
                // Kick off update request here.
			}
		});
	}

	editor.addCommand('mceCite', showDialog);

	editor.addButton('citeaddedit', {
		icon: false,
		text: 'Add/Edit citation',
		onclick: showDialog
		//stateSelector: 'span:not([class*="citation"])'
	});

	editor.addMenuItem('citeaddedit', {
		icon: false,
		text: 'AddEdit citation',
		context: 'insert',
		onclick: showDialog
	});


});
