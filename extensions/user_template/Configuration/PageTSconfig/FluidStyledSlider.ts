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
        fs_slider
        {
            iconIdentifier = content - image
            title = LLL
        :
            user_template / Resources / Private / Language / locallang_slider_be.xlf
        :
            wizard.title
            description = LLL
        :
            user_template / Resources / Private / Language / locallang_slider_be.xlf
        :
            wizard.description
            tt_content_defValues
            {
                CType = fs_slider
            }
        }
    }

    = addToList(fs_slider)
}