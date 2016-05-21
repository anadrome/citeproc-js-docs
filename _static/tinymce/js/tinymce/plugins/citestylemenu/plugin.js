tinymce.PluginManager.add('citestylemenu', function(editor) {

   editor.addButton('citestylemenu', {
      type: 'listbox',
      text: 'Citation style',
      icon: false,
      onselect: function (e) {
          alert('Selected ' + this.value());
      },
      values: [
        { text: "ACM Proceedings", value: "acm-sig-proceedings" },
        { text: "AMA", value: "american-medical-association" },
        { text: "Chicago (author-date)", value: "chicago-author-date" },
        { text: "Chicago (full note)", value: "jm-chicago-fullnote-bibliography" },
        { text: "DIN-1505-2 (alpha)", value: "din-1505-2-alphanumeric" },
        { text: "JM Indigo", value: "jm-indigobook" },
        { text: "JM Indigo (L. Rev.)", value: "jm-indigobook-law-review" },
        { text: "JM OSCOLA", value: "jm-oscola" }
      ],
      onPostRender: function () {
        // Select the second item by default
        this.value("american-medical-association");
      }
    });

});
