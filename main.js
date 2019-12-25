const personalProjects = 
{
    'Scale Scrambler':
    {
        lang: 'HTML/CSS/JS + Bootstrap',
        desc: 'Responsive web app that randomizes fundamental exercises to supplement music practice',
        sourceCode: 'https://github.com/debashisbiswas/scales',
        projectLink: 'https://debashisbiswas.github.io/scales'
    },
    'Todoica': 
    {
        lang: 'Heroku + Node.js',
        desc: 'Synchronizes tasks between task manager applications Todoist and Habitica',
        sourceCode: 'https://github.com/debashisbiswas/todoica',
    },
    'Bitmap Image Processor': 
    {
        lang: 'C',
        desc: 'Multithreaded C program that reads bitmap images and alters color data using multiple threads',
        sourceCode: 'https://github.com/debashisbiswas/multithreaded_bmpreader',
    },
    'Music Exercise Randomizer':
    {
        lang: 'Python',
        desc: 'Randomizes fundamental exercises to supplement music practice',
        sourceCode: 'https://github.com/debashisbiswas/music-fundamentals',
    },
    'Pitch Transposer':
    {
        lang: 'Python',
        desc: 'Transposes pitches between two specified keys',
        sourceCode: 'https://github.com/debashisbiswas/transposer',
    },
    'Teleprompter':
    {
        lang: 'Java + Kotlin',
        desc: 'Teleprompter Android App on the Google Play Store',
        sourceCode: 'https://github.com/debashisbiswas/teleprompter',
        projectLink: 'https://play.google.com/store/apps/details?id=com.maestoso.teleprompter'
    },
    'Clarinet Spectral Analysis':
    {
        lang: 'Firebase + HTML/CSS + Bootstrap',
        desc: 'Firebase website displaying research findings of fellow music student',
        sourceCode: 'https://github.com/debashisbiswas/vashawn-analysis-website',
        projectLink: 'https://vashawn-clarinet.web.app/'
    },
}

const openSourceContributions = 
{
    'Habitica for Android':
    {
        lang: 'Java + Kotlin',
        desc: 'A habit-building application that uses game mechanics from classic RPGs to motivate players',
        sourceCode: 'https://github.com/HabitRPG/habitica-android',
    },
    'Stardew Checkup':
    {
        lang: 'HTML/CSS/JS',
        desc: 'Checks achievement and milestone progress on a Stardew Valley save file',
        sourceCode: 'https://github.com/MouseyPounds/stardew-checkup',
    },
    'Horace':
    {
        lang: 'JavaScript + Node.js',
        desc: 'Discord bot that oversees the Knights of Academia Discord server',
        sourceCode: 'https://github.com/Knights-Of-Academia/horace',
    },
}

const musicPerformances = 
{
    'Szalowski: Sonatina - 1, 2':
    {
        date: 'December 2, 2019',
        embedLink: 'https://www.youtube.com/embed/JgM6tUMkcaY',
    },
    'Weber: Concertino':
    {
        date: 'July 15, 2019',
        embedLink: 'https://www.youtube.com/embed/0YFkiAuHW-M',
    },
    'Shared Recital with Selena Graf':
    {
        date: 'April 14, 2019',
        embedLink: 'https://www.youtube.com/embed/7m8qzWEhSZM?start=565',
    },
    'Mandat: Tricolor Capers - 1, 2':
    {
        date: 'October 28, 2019',
        embedLink: 'https://www.youtube.com/embed/LWCXOTGhLk0',
    },
    'Mandat: Tricolor Capers - 1':
    {
        date: 'September 23, 2019',
        embedLink: 'https://www.youtube.com/embed/Wl-MR09BpGc',
    },
    'Devienne: Deuxieme Sonata':
    {
        date: 'March 18, 2019',
        embedLink: 'https://www.youtube.com/embed/MZBN6R462Zw',
    },
}

function isUndefined( aObject )
{
    return typeof aObject === 'undefined';
}

var theGridCardClasses = 'row row-cols-1 row-cols-md-2 row-cols-xl-3';
var theCardContainerClasses = 'col mb-4';

function generateProjectSection( aProjectObject )
{
    // opening div
    var theOutput = `<div class="${ theGridCardClasses }">`;

    for( projectName in aProjectObject )
    {
        var currentProject = aProjectObject[ projectName ];

        var theCardBody = `\
        <div class="card-body">
            <h5 class="card-title">${ projectName }</h5>
            <h6 class="card-subtitle mb-2 text-muted">${ currentProject.lang }</h6>
            <p class="card-text">${ currentProject.desc }</p>
        </div>`;

        // footer is required if either are defined
        var footerRequired = !isUndefined( currentProject.sourceCode ) || !isUndefined( currentProject.projectLink );

        var theProjectLink = `${ !isUndefined( currentProject.projectLink ) ? `\
        <div class="col">
            <a href="${ currentProject.projectLink }" target="_blank" class="btn btn-primary btn-block">See project</a>
        </div>` : '' }`

        var theSourceCodeLink = `${ !isUndefined( currentProject.sourceCode ) ? `\
        <div class="col">
            <a href="${ currentProject.sourceCode }" target="_blank" class="col btn btn-primary btn-block">Source code</a>
        </div>` : '' }`

        var theCardFooter = `\
        <div class="card-footer ${ footerRequired ? '' : 'd-none' }">
            <div class="row">
                ${ theProjectLink }
                ${ theSourceCodeLink }
            </div>
        </div>`;

        // add item
        theOutput += `\
        <div class="${ theCardContainerClasses }">
            <div class="card text-center h-100">
                ${ theCardBody }
                ${ theCardFooter }
            </div>
        </div>`;
    }

    // closing div
    theOutput += `</div>`;

    return theOutput;
}

function generateMusicSection( aMusicObject )
{
    // opening div
    var theOutput = `<div class="${ theGridCardClasses }">`;

    for( performanceTitle in aMusicObject )
    {
        var currentPerformance = aMusicObject[ performanceTitle ];

        var theEmbedSection = `\
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item" src="${ currentPerformance.embedLink }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>`;

        var theCardBody = `\
        <div class="card-body text-center">
            <h5 class="card-title">${ performanceTitle }</h5>
            <p class="card-text text-muted">${ currentPerformance.date }</p>
        </div>`;

        // add item
        theOutput += `\
        <div class="${ theCardContainerClasses }">
            <div class="card text-center h-100">
                ${ theEmbedSection }
                ${ theCardBody }
            </div>
        </div>`;
    }

    // closing div
    theOutput += `</div>`;

    return theOutput;
}

$( document ).ready(()=>
{
    $( '#projects-placeholder' ).html( generateProjectSection( personalProjects ) );
    $( '#opensourceprojects-placeholder' ).html( generateProjectSection( openSourceContributions ) );
    $( '#performances-placeholder' ).html( generateMusicSection( musicPerformances ) );
});