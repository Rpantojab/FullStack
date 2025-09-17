sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/logaligroup/legalguardians/test/integration/FirstJourney',
		'com/logaligroup/legalguardians/test/integration/pages/LegalGuardiansSetMain'
    ],
    function(JourneyRunner, opaJourney, LegalGuardiansSetMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/logaligroup/legalguardians') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheLegalGuardiansSetMain: LegalGuardiansSetMain
                }
            },
            opaJourney.run
        );
    }
);