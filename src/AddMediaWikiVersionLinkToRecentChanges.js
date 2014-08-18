/**
 * Add a link to [[Special:RecentChanges]] indicating the current version of MW
 * @author: Helder (https://github.com/he7d3r)
 * @license: CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/>
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/AddMediaWikiVersionLinkToRecentChanges.js]] ([[File:User:Helder.wiki/Tools/AddMediaWikiVersionLinkToRecentChanges.js]])
 */
/*jshint browser: true, camelcase: true, curly: true, eqeqeq: true, immed: true, latedef: true, newcap: true, noarg: true, noempty: true, nonew: true, quotmark: true, undef: true, unused: true, strict: true, trailing: true, maxlen: 135, evil: true, onevar: true */
/*global jQuery, mediaWiki */
( function ( $, mw ) {
'use strict';

function addMWVersion( data ){
	if( !data.query ) {
		return;
	}
	var	geral = data.query.general,
		curRev = geral['git-hash'],
		// Last checked revision
		oldRev = $.cookie( mw.config.get('wgCookiePrefix') + 'mw-last-checked-rev' ) || String(undefined),
		HTML = geral.generator + ':' + curRev.substr( 0, 7 ),
		branch = geral.generator.match( /^MediaWiki (.+)$/ )[ 1 ],
		$div = $( '<div id="my-mw-version"></div>' ),
		$versionLink = $( '<a>' + HTML + '</a>' ).attr( {
			'href': 'https://git.wikimedia.org/log/mediawiki%2Fcore.git/refs%2Fheads%2Fwmf%2F' + branch,
			'class': 'updated',
			'title': 'Ver as alterações recentes no branch /wmf/' + branch + '.'
		} ),
		$okLink = $( '<a>ok</a>' )
			.attr( 'href', '//pt.wikibooks.org/wiki/User:Helder.wiki/Tools/AddMediaWikiVersionLinkToRecentChanges.js?action=edit' )
			.click( function(e){
				e.preventDefault();
				$.cookie( mw.config.get('wgCookiePrefix') + 'mw-last-checked-rev', curRev, {
					expires: 30,
					path: '/'
				} );
				// Reloads the document (from the cache)
				document.location.reload( false );
			} ),
		$normalLink = $('<a>' + HTML + '</a>' )
			.attr( 'href', mw.util.getUrl( 'Special:Version' ) );
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

if ( $.inArray( mw.config.get( 'wgCanonicalSpecialPageName' ), [ 'Recentchanges', 'Watchlist' ] ) !== -1 ) {
	mw.loader.using( 'mediawiki.api', function () {
		( new mw.Api() ).get( {
			action: 'query',
			meta: 'siteinfo'
		} )
		.done( addMWVersion );
	} );
}

}( jQuery, mediaWiki ) );