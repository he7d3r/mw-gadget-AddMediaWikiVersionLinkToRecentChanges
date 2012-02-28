/**
 * Add a link to [[Special:RecentChanges]] indicating the current version of MW
 * @traking: [[Special:GlobalUsage/User:Helder.wiki/Tools/AJAXTest.js]] ([[File:User:Helder.wiki/Tools/AJAXTest.js]])
 */
if ( 'Recentchanges' == mw.config.get( 'wgCanonicalSpecialPageName' ) ) {
    $.getJSON(
	mw.util.wikiScript( 'api' ), {
			'format': 'json',
			'action': 'query',
			'meta': 'siteinfo'
		}, function(data) {
			if( data && data.query ) {
				var	geral = data.query.general,
					curRev = geral.rev,
					oldRev = $.cookie( 'mw-last-checked-rev' ) || 99292, // Last checked revision
					HTML = geral.generator + ': r' + curRev,
					branch = geral.generator.match( /MediaWiki (.+)/ )[ 1 ];
				mw.util.addCSS(
					'#my-mw-version { z-index:1; font-size:75%; position:absolute; top: 2px; left:2px; }' +
					'#my-mw-version a.updated { color:green; font-weight:bold; }'
				);
				var	$div = $( '<div id="my-mw-version"></div>' ),
					$versionLink = $( '<a>' + HTML + '</a>' ).attr( {
						'href': '//www.mediawiki.org/wiki/Special:Code/MediaWiki?path=%2Fbranches%2Fwmf%2F' + branch,
						'class': 'updated',
						'title': 'Ver as alterações recentes no branch /wmf/' + branch + '.'
					} ),
					$okLink = $( '<a>ok</a>' )
						.attr( 'href', '//pt.wikibooks.org/wiki/User:Helder.wiki/common.js?action=edit' )
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
				if ( oldRev < curRev ) {
					$div.append( $versionLink )
						.append( ' ( ' )
						.append( $okLink )
						.append( ' )' );
				} else {
					$div.append( $normalLink );
				}
				$div.appendTo( '#mw-head' );
			}
		}
	);
}