========
CSL-JSON
========

.. include:: ../substitutions.txt
|CCBYSA| `Frank Bennett <https://twitter.com/fgbjr>`_

------------------------

------------
Introduction
------------

Citation data is added to the instantiated processor in JSON format, using
one of two structures:

* CSL-JSON `items` carry the details of individual references.  These
  must be made available to the `retrieveItem()` hook supplied by the
  calling application. Item data is in one of three forms:

  * Date fields.
  * Name fields.
  * Ordinary fields (both text or numeric).
    
    * In text fields, the processor recognizes a limited set of
      HTML-like tags for visual formatting.

* CSL-JSON `citations` carry the details of specific in-document
  citations:

  * Document position and configuration (such as sorting or the use of
    terminal punctuation); and
  * One or more `items` to be used in composing the citation, and
    pinpoint reference, prefix, and suffix details for each.

The structure of `item` and `citation` objects is described
below. The HTML-like syntax use to control string formatting
is described separately, as it has impact at user level.

--------------
CSL-JSON Items
--------------

Encoding citation data items in properly formatted CSL-JSON is essential to getting correct results from the CSL Processor. Each citation item is composed of fields of various types. Multiple citation items can be packaged into a container, which allows related citations to be treated as a unit of citations.

Field Types
===========

!!!!!!!!!!
*ID* Field
!!!!!!!!!!

**Required.** The *id* field is a simple field containing any string or numeric value. The value of the ID field must uniquely identify the item, as this field is used to retrieve items by their ID value.

.. code-block:: javascript

   {
	"id":"unique_string-1219205"
   }

!!!!!!!!!!!!
*Type* Field
!!!!!!!!!!!!

**Required.** The *type* field is a simple field containing a string value. CSL-JSON constrains the possible for values of the *type* field to a limited set of possible values (*e.g.*, "book" or "article"). The type must be a valid CSL type under the schema of the installed style. See the schemata of `CSL <https://github.com/citation-style-language/schema/blob/master/csl-types.rnc>`_ and `CSL-M <https://github.com/Juris-M/schema/blob/master/csl-mlz.rnc#L763>`_ for their respective lists of valid types.

.. code-block:: javascript

   {
	"id":"unique_string-1219205",
	"type":"book"
   }

!!!!!!!!!!!!!!!!!!!
Ordinary Field Type
!!!!!!!!!!!!!!!!!!!
An ordinary field type is a simple field containing a string or numeric value. In ordinary fields, the processor recognizes a limited set of HTML-like tags for visual formatting. (See `HTML-like formatting tags`_). One common ordinary field is *title* which identifies the title of the citation item. The fields that a citation may have is determined by the item type (see previous). Unrecognized fields will be simply ignored by the CSL processor. For the fields available on each item type, see the `listing for CSL <http://aurimasv.github.io/z2csl/typeMap.xml>`_ provided by Aurimas Vinckevicius, and `that for CSL-M <http://fbennett.github.io/z2csl/>`_ provided by yours truly.

.. code-block:: javascript

   {
	"id":"unique_string-1219205",
	"type":"book",
	"title":"Book Title",
	"arbitraryField":"An example arbitrary field with arbitrary data. This field will be ignored by the CSL Processor."
   }

!!!!!!!!!!!!!!!!!
Person Field Type
!!!!!!!!!!!!!!!!!
A Person Field is a complex field that lists persons as authors, contributors, or creators, etc. The field is an array of objects, with each object containing information about one person. Date fields should generally have two properties: "family", and "given". The "family" property represents the familial name that a person inherits. The "given" property represents the name a person has been given.

The CSL-JSON allows some flexibility about how parts of a person's name are encoded. For instance, family name affixes such as "van" and "de las" can be encoded as part the family name in the "family" property. Likewise, suffixes such as titles, generational designations, credentials, and honors can be encoded as part of the given name. Generational designations (like "Jr" or "IV") immediately follow the given name without a comma. All other suffixes should follow next, with each suffix preceeded by a comma.

.. code-block:: javascript

   "author": [
	{
		"family": "de las Casas",
		"given": "Bartolomé",
	},
	{
		"family": "King",
		"given": "Rev. Martin Luther Jr., Ph.D.",
	}
   ]

In the previous example, lowercase elements before the family name are treated as “non-dropping” particles, and lowercase elements following the given name as “dropping” particles. However, these special name parts could also be encoded in discrete properties.

.. code-block:: javascript

   "author": [
	{
		"family": "Casas",
		"given": "Bartolomé",
		"non-dropping-particle":"de las"
	},
	{
		"family": "King",
		"given": "Martin Luther",
		"suffix":"Jr., Ph.D.",
		"dropping-particle":"Rev."
	}
   ]

Some personal names are represented by a single field (e.g. mononyms such as "Prince" or "Plato"). In such cases, the name can be delivered as a lone family element. Institutional names may be delivered in the same way, but it is preferred to set them instead as a literal element:

.. code-block:: javascript

   "author": [
	{
		"family": "Socrates",
	},
	{
		"literal": "International Business Machines"
	}
   ]

!!!!!!!!!!!!!!!
Date Field Type
!!!!!!!!!!!!!!!
A date field is a complex field that expresses a date or a range of dates. An example date field in CSL is *issued*, which identifies the date an item was issued or published. Date fields can be expressed in two different formats. The first format is an array format. To express a date range in this format, the ending date would be set as a second array.

*Array Format*

.. code-block:: javascript

   "archived": [
	{
		"date-parts": [ 2005, 4, 12 ]
	}
   ],
   "issued": [
	{
		"date-parts": [[ 2000, 3, 15 ], [2000, 3, 17]]
	}
   ]

The second date format is a raw string. The recommended encoding is a string that represents the date in a numberic year-month-day format. However, the date parser in citeproc-js will correctly interpret a wide variety of sensible date conventions.

*Raw Format*

.. code-block:: javascript

   "archived": [
	{
		"raw": "2005-4-12"
	}
   ],
   "issued": [
	{
		"raw": "2000-3-15/2000-3-17"
	}
   ]
		      
Citation Items Container
========================

In CSL-JSON, a container for citation items is an array. When passing citation items to the Processor, an array ensures that the ordering of citations is preserved.

.. code-block:: javascript

   CitationItems = [
	{
		"id":"item1",
		"type":"article",
		"title":"Title for an Article"
	},
	{
		"id":"item2",
		"type":"book",
		"title":"Book title"
	}
   ]
   
-------------------------
HTML-like formatting tags
-------------------------

Several tags are recognized in CSL-JSON input. While they are set in
an HTML-like syntax for convenience of processing, that mimicry does
not imply general support for HTML markup in the processor: tags that
do not fit the patterns described below are treated as raw text, and
will be escaped and rendered verbatim in output.

Note that tags must be JSON-encoded in the input object::

   This is &lt;italic&gt; text.

**<i>italics</i>**
  Set the enclosed text in *italic* style. This tag will "flip-flop,"
  setting the text in roman type if the style applies italic style
  to the field.

**<b>bold</b>**
  Set the enclosed text in **boldface** type. This tag will "flip-flop,"
  setting the text in roman type if the style applies boldface type
  to the field.

**<span style="font-variant: small-caps;">superscript</span>**
  Set the enclosed text in |small-caps|. This tag will "flip-flop,"
  setting the text in roman type if the style applies small-caps
  to the field.

**<sup>superscript</sup>**
  Set the enclosed text in |superscript| form.

**<sub>subscript</sub>**
  Set the enclosed text in |subscript| form.

**<span class="nocase">superscript</span>**
  Suppress case-changes that would otherwise be applied to the
  enclosed text by the style.

-------------------------------
"Cheater Syntax" for Odd Fields
-------------------------------

The CSL variables needed to render a particular citation may not be
available directly in the data structures of a calling application.
For those situations, the processor can recognize supplementary values
entered into the ``note`` field of a CSL item. The facility is
available when the processor is run with the ``field_hack`` option
(default is ``true``)::

  citeproc.opt.development_extensions.field_hack = true

This method of data entry is intended as a temporary workaround to
avoid blocking issues in user projects; it is not supported by all CSL
processors, and does not form part of the CSL standard.

Two forms of "cheater syntax" are recognized in the CSL ``note`` field.
When ``field_hack`` is enabled, the processor will recognize both,
and the two forms may be mixed within the field.

.. _variable-names-tip:

.. tip:: **Variable Names**

   In the braced-entry and line-entry descriptions below, a
   recognized ``<variable_name>`` is one which consists of:

   * Uppercase roman characters *only* (i.e. ``[A-Z]+``); or
   * Lowercase roman characters, hyphens, or underscores *only* (i.e. ``[-_a-z]+``).

Braced-entry
============

Awkward to type, ugly to read and fragile, the braced-entry syntax has
been recognized by the processor for several years, and a significant
proportion of entries in circulation rely on it. The general markup
pattern for a single variable looks like this::

  {:<variable_name>:<value>}

A recognized ``<variable_name>`` must appear be between the colons
(see :ref:`Tip: Variable Names <variable-names-tip>` above).  Arbitrary
text, including spaces but excluding newlines, is permitted after the
second colon (leading and trailing space will be trimmed from the
variable value). There is no means of escaping a closing brace.

Line-entry
==========

Full support for the line-entry format debuted with ``citeproc-js``
version ``1.1.135``, in belated response to repeated suggestions on
the Zotero forums. The general markup for inline syntax looks like
this::

  <variable_name>:<value>

The line must begin with a recognized ``<variable_name>`` punctuated
with a colon (see :ref:`Tip: Variable Names <variable-names-tip>`
above). Arbitrary text, including spaces, is permitted to the end of
the line (leading and trailing space will be trimmed from the variable
value).

Handling of entries
===================

Conforming braced-entries and line-entries must occur at the top of
the ``note`` field. The set of entries may begin on the first *or* the
second line of the field: parsing stops when the parser encounters a
non-empty line *after the first* that does not fit the descriptions
above.  Parsed entries are removed from the ``note`` field before onward
processing.

Multiple entries are recognized. In the case of name variables (see
below), entries are cumulative; for other variables, the last entry
encountered wins (but see the cautionary notes on the override of
existing item data, below).


Value formats
=============

Variables that can be set with the "cheater syntax" are of four types:
*date*, *name*, *type*, and *ordinary*

**Date variables**
  Date variables should be entered in ISO year-month-day syntax::

      original-date: 2001-12-31

  The processor's internal date parsing function, applied to the
  date content, recognizes date ranges as well::

      original-date: 2001-12-15/2001-12-31

  .. caution:: **Overrides (date variables)**

     By default, date variables entered in "cheater syntax" will override
     an existing value in the item. This is permitted because the processor's
     internal parser may offer better recognition of date forms (such as ranges)
     than that of the calling application. Date value override may be disabled
     by setting the relevant toggle to ``false`` after processor instantiation::
       
       citeproc.opt.development_extensions.allow_field_hack_date_override = false
  

**Name variables**
  Name variables come in two flavors: single-field names and two-field names.
  Personal names are ordinarily of the two-field flavor. Fields are separated
  by *double* field-separator characters (``||``)::

      editor: Thompson || Hunter S.

  Single-field names may represent institutions, and these may be
  composed of several sub-units separated by a *single* field-separator
  character (``|``)::

      author: Prince
      author: National Weather Service|Office of International Affairs

  .. caution:: **Overrides (name variables)**

     Unlike the other variable types, entries for name variables are cumulative;
     however, name entries in "cheater syntax" will not override an existing
     creator of the same CSL category.

**Item type**
  The item type may also be set with either syntax::

      type: dataset

  Note, however, that when a type not recognized by the target style
  is set in this way, the item will be processed as an untyped item
  (sometimes described as a generic type such as "Document" in calling
  applications).

  .. caution:: **Overrides (item type)**

     An item type value set in "cheater syntax" always overrides the
     existing item type.

**Ordinary variables**
  Entries other than those above are assumed to be ordinary variables.
  these are set literally on the item, with no pre-processing.

  .. caution:: **Overrides (ordinary variables)**

     Ordinary variables set in "cheater syntax" will not override
     an existing value for the same variable.
