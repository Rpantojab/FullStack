sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/logaligroup/therapist/test/integration/pages/TherapistsSetMain"
], function (JourneyRunner, TherapistsSetMain) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/logaligroup/therapist') + '/index.html',
        pages: {
			onTheTherapistsSetMain: TherapistsSetMain
        },
        async: true
    });

    return runner;
});

