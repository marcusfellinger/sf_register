# **************************************************
#
Add
the
slider
to
the
"New Content Element Wizard"
# **************************************************
mod.wizards.newContentElement.wizardItems.common
{
    elements
    {
        cg_teaser
        {
            iconIdentifier = content - image
            title = LLL
        :
            user_template / Resources / Private / Language / locallang_teaser_be.xlf
        :
            wizard.title
            description = LLL
        :
            user_template / Resources / Private / Language / locallang_teaser_be.xlf
        :
            wizard.description
            tt_content_defValues
            {
                CType = cg_teaser
            }
        }
    }

    = addToList(cg_teaser)
}