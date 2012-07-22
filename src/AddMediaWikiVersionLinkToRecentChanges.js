/**
 * Add a link to [[Special:RecentChanges]] indicating the current version of MW
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/AddMediaWikiVersionLinkToRecentChanges.js]] ([[File:User:Helder.wiki/Tools/AddMediaWikiVersionLinkToRecentChanges.js]])
 */
/*jslint browser: true, white: true, regexp: true*/
/*global jQuery, mediaWiki */
( function ( $, mw ) {
'use strict';

function addMWVersion( data ){
	if( !data.query ) {
		return;
	}
	var	geral = data.query.general,
		curRev = geral['git-hash'],
		oldRev = $.cookie( 'mw-last-checked-rev' ) || String(undefined), // Last checked revision
		HTML = geral.generator + ':' + curRev.substr( 0, 7 ),
		branch = geral.generator.match( /MediaWiki (.+)/ )[ 1 ],
		$div = $( '<div id="my-mw-version"></div>' ),
		$versionLink = $( '<a>' + HTML + '</a>' ).attr( {
			'href': 'https://gerrit.wikimedia.org/r/gitweb?p=mediawiki%2Fcore.git;a=shortlog;h=refs%2Fheads%2Fwmf%2F' + branch,
			'class': 'updated',
			'title': 'Ver as alterações recentes no branch /wmf/' + branch + '.'
		} ),
		$okLink = $( '<a>ok</a>' )
			.attr( 'href', '//pt.wikibooks.org/wiki/User:Helder.wiki/Tools/AddMediaWikiVersionLinkToRecentChanges.js?action=edit' )
			.click(function(e){
				e.preventDefault();
				$.cookie( 'mw-last-checked-rev', curRev, {
					expires: 30,
					path: '/'
				} );
				document.location.reload( false ); // Reloads the document (from the cache)
			}),
		$normalLink = $('<a>' + HTML + '</a>' )
			.attr( 'href', mw.util.wikiGetlink( 'Special:Version' ) );
	mw.util.addCSS(
		'#my-mw-version { z-index:1; font-size:75%; position:absolute; top: 2px; left:2px; }' +
		'#my-mw-version a.updated { color:green; font-weight:bold; }'
	);
	if ( oldRev !== String(curRev) ) {
		$div.append( $versionLink )
			.append( ' ( ' )
			.append( $okLink )
			.append( ' )' );
	} else {
		$div.append( $normalLink );
	}
	$div.appendTo( '#mw-head' );
}

if ( 'Recentchanges' === mw.config.get( 'wgCanonicalSpecialPageName' ) ) {
	mw.loader.using( ['mediawiki.api'], function () {
		var api = new mw.Api();
		api.get( {
			'action': 'query',
			'meta': 'siteinfo'
		}, {
			ok: addMWVersion
		} );
	} );
}

}( jQuery, mediaWiki ) );