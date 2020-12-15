<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" dir="{$_config.manager_direction}" lang="{$_config.manager_lang_attribute}" xml:lang="{$_config.manager_lang_attribute}">
<head>
<title>{if $_pagetitle}{$_pagetitle|escape} | {/if}{$_config.site_name|strip_tags|escape}</title>
<meta http-equiv="Content-Type" content="text/html; charset={$_config.modx_charset}" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    {if $_config.manager_favicon_url}<link rel="shortcut icon" href="{$_config.manager_favicon_url}" />{/if}

<link rel="stylesheet" type="text/css" href="{$_config.manager_url}assets/ext3/resources/css/ext-all-notheme-min.css" />
<link rel="stylesheet" type="text/css" href="{$indexCss}?v={$versionToken}" />

{if isset($_config.ext_debug) && $_config.ext_debug}
<script src="{$_config.manager_url}assets/ext3/adapter/ext/ext-base-debug.js" type="text/javascript"></script>
<script src="{$_config.manager_url}assets/ext3/ext-all-debug.js" type="text/javascript"></script>
{else}
<script src="{$_config.manager_url}assets/ext3/adapter/ext/ext-base.js" type="text/javascript"></script>
<script src="{$_config.manager_url}assets/ext3/ext-all.js" type="text/javascript"></script>
{/if}
<script src="{$_config.manager_url}assets/modext/core/modx.js?v={$versionToken}" type="text/javascript"></script>
<script src="{$_config.connectors_url}lang.js.php?ctx=mgr&topic=topmenu,file,resource,trash,{$_lang_topics}&action={$smarty.get.a|default|htmlspecialchars}" type="text/javascript"></script>
<script src="{$_config.connectors_url}modx.config.js.php?action={$smarty.get.a|default|htmlspecialchars}{if $_ctx}&wctx={$_ctx}{/if}" type="text/javascript"></script>

{$maincssjs}
{foreach from=$cssjs item=scr}
{$scr}
{/foreach}

<script type="text/javascript">
    Ext.onReady(function() {
        // Enable site name tooltip (on overflow only)
        if( Ext.get('site_name').dom.scrollWidth > Ext.get('site_name').dom.clientWidth ){
          new Ext.ToolTip({
              title: Ext.get('site_name').dom.title
              ,target: Ext.get('site_name')
          });
        }
        {if $_search}
        new MODx.SearchBar;
        {/if}
    });
</script>

</head>
<body id="modx-body-tag">

