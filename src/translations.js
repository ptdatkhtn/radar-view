import { initTranslations } from '@sangre-fp/i18n'

const localTranslations = {
    pptxTimestamp: {
      en: 'Timestamp',
      fi: 'Ajankohta'
    },
    pptxCommentsTitle: {
      en: 'Comments',
      fi: 'Kommentit'
    },
    pptxCommentsText: {
      en: count => `There are ${count === 0 ? 'no' : count } comment${count !== 1 ? 's' : ''} on this radar. To review them${count === 0 ? ' later': ''}, please log in to the platform and click this link: `,
        fi: count => count === 0 ? 'Kartalle ei ole vielä käyttäjien kommentteja. Pääset katsomaan niitä myöhemmin kirjautumalla palveluun ja klikkaamalla tätä linkkiä: ' : `Kartalla on yhteensä ${count} käyttäjien kommentti${count > 1 ? 'a' : ''}. Pääset katsomaan niitä kirjautumalla palveluun ja klikkaamalla tätä linkkiä: `
    },
    download: {
        en: 'Download',
        fi: 'Lataa'
    },
    downloadPPTXDescription: {
        en: 'Download radar summary in PowerPoint format.',
        fi: 'Lataa yhteenveto PowerPoint-muodossa.'
    },
    pptxGenerateReport: {
        en: 'Download summary (ppt)',
        fi: 'Lataa yhteenveto (ppt)'
    },
    generatingPPTXError: {
        en: `generating PowerPoint`,
        fi: `raporttia luodaan`
    },
    pptxNotVoted: {
      en: 'Not voted',
      fi: 'Ei ääniä'
    },
    pptxReportBy: {
      en: 'by',
      fi: '-'
    },
    pptxSectorListTitle: {
      en: 'List of Sectors',
      fi: 'Sektorit'
    },
    pptxRatedContent: {
        en: 'Rated Content',
        fi: 'Arvioitu sisältö'
    },
    pptxReportTitle: {
        en: 'Content Summary',
        fi: 'Yhteenveto'
    },
    pptxSector: {
        en: 'Sector',
        fi: 'Sektori'
    },
    pptxSectorContent: {
        en: 'Content in the Sector',
        fi: 'Sektorin sisältö'
    },
    pptxTopVotedContent: {
        en: 'Top-Voted Content',
        fi: 'Äänestetyt ilmiöt'
    },
    timelineModeTitle: {
        en: `Please confirm you want to switch the label format`,
        fi: `Haluatko, että haluat muuttaa aikajanan formaattia`
    },
    timelineModeSubtitle: {
        en: ``,
        fi: ``
    },
    timelineDeleteTitle: {
        en: year => `Delete ${year}?`,
        fi: year => `Poista ${year}?`
    },
    timelineDeleteSubtitle: {
        en: `You're about to remove this time range. The content on the radar will not be removed, it will be re-organised according to the remaining ranges. Do you want to continue??`,
        fi: `Olet poistamassa aikakehää. Sen sisältöä ei poisteta, vaan se järjestetään uudelleen jäljelle jäävien kehien mukaisesti. Haluatko jatkaa?`
    },
    addTimelineButton: {
        en: `+ ADD NEW RANGE`,
        fi: `+ LISÄÄ UUSI KEHÄ`
    },
    deleteSignalConfirmation: {
        en: 'Are you sure?',
        fi: 'Oletko varma?'
    },
    description: {
        en: `Description`,
        fi: `Kuvaus`
    },
    year: {
        en: `Year`,
        fi: `Vuosi`
    },
    add: {
        en: `Add`,
        fi: `Lisää`
    },
    timerangeBoundaryError: {
        en: ({ firstYear, lastYear }) => `Please enter a valid input between ${firstYear} and ${lastYear}`,
        fi: ({ firstYear, lastYear }) => `Syötä vuosi väliltä  ${firstYear} ja ${lastYear}`,
    },
    timerangeSpaceError: {
        en: ({ previousYear, nextYear }) => `There's not enough space between ${previousYear} and ${nextYear} on your timerange. Please adjust your time ranges`,
        fi: ({ previousYear, nextYear }) => `Vuosien ${previousYear} ja ${nextYear} välillä ei ole tilaa uudelle kehälle. Tee väliin tilaa (vuosilukuina) ja yritä uudestaan`,
    },
    timerangeAmountError: {
        en: `You have reached the maxiumum amount of timeranges, please remove a timerange before trying to add a new one.`,
        fi: `Kartalle ei mahdu useampia kehiä. Voit poistaa yhden lisätäksesi uuden tai nimetä nykyiset kehät uudelleen.`
    },
    timerangeError: {
        en: `Please enter a valid input`,
        fi: `Syötä vuosiluku`
    },
    timerangeSmallerYearError: {
        en: nextYear => `Please enter a year smaller than ${nextYear}`,
        fi: nextYear => `Syötä vuosiluku ennen vuotta ${nextYear}`,
    },
    timerangeLargerYearError: {
        en: previousYear => `Please enter a year larger than ${previousYear}`,
        fi: previousYear => `Syötä vuosiluku ${previousYear} jälkeen`,
    },
    timerangeCurrentYearError: {
        en: currentYear => `Please enter a year after ${currentYear}`,
        fi: currentYear => `Syötä vuosiluku ${currentYear} jälkeen`,
    },
    timelineEditor: {
        en: `Timerange editor`,
        fi: `Aikajakson muokkaus`
    },
    updatingTimelinesPositionError: {
        en: `updating your timerange's position`,
        fi: `päivitetään aikajakson sijaintia`
    },
    removingTimelineError: {
        en: `removing your timerange`,
        fi: `poistetaan aikajakso`
    },
    addingTimelineError: {
        en: `adding your timerange`,
        fi: `lisätään aikajakso`
    },
    timerangeExistsError: {
        en: `This timerange already exists!`,
        fi: `Tämä aikajakso on jo olemassa!`
    },
    label: {
        en: `Label`,
        fi: `Kehän nimi`
    },
    typeLabel: {
        en: 'Type label',
        fi: 'Tyypin nimi'
    },
    labelPosition: {
        en: 'Label position',
        fi: 'Kehän nimen sijainti'
    },
    afterLabel: {
        en: previousLabel => `Below ${previousLabel}`,
        fi: previousLabel => `Alapuolelle ${previousLabel}`
    },
    consecutiveYearError: {
        en: 'The years behind these labels are consectuive, please switch back to year format and adjust for space before continuing',
        fi: 'Vuosileimat kehien nimien taustalla ovat peräkkäiset. Palauta aikajana vuosi-formaattiin ja tee tilaa ennen kuin jatkat.'
    },
    filterPhenomena: {
        en: `Filter content`,
        fi: `Suodata sisältö`
    },
    goToHub: {
        en: 'Open the hub',
        fi: 'Avaa Hub'
    },
    moreInfoHub: {
        en: 'For more info go to the hub',
        fi: 'Lisää tietoa löydät HUBista (englanniksi)'
    },
    toggleTimelineMode: {
        en: `Use text labels instead of years`,
        fi: `Käytä tekstiä vuosiluvun sijaan`
    },
    done: {
        en: `DONE`,
        fi: `VALMIS`
    },
    confirm: {
        en: `CONFIRM`,
        fi: `MUOKKAA`
    },
    cancel: {
        en: `CANCEL`,
        fi: `PERUUTA`
    },
    filterByType: {
        en: `BY TYPE`,
        fi: `TYYPIT`
    },
    filterByTag: {
        en: `BY TAG`,
        fi: `TAGIT`
    },
    openPublicLink: {
        en: `SHOW THE SHARED LINK`,
        fi: `NÄYTÄ JAETTAVA LINKKI`
    },
    createPublicLink: {
        en: `CREATE A SHARED LINK`,
        fi: `LUO JAETTAVA LINKKI`
    },
    publicLink: {
        en: `Shared Link`,
        fi: `Jaettava linkki`
    },
    publicLinkNote: {
        en: `Copy the link and share it in your network. Anyone with the link can access the radar and collaborate. For data privacy reasons, we recommend deleting the shared link when it’s not used anymore.`,
        fi: `Kopioi linkki, ja jaa se verkostossasi. Otathan huomioon, että linkkiä klikkaamalla tälle kartalle pääsee kuka tahansa. Tietoturvasyistä suosittelemme jaettavan linkin poistamista, kun sitä ei enää tarvita.`
    },
    regeneratePublicLink: {
        en: `REGENERATE LINK`,
        fi: `LUO UUSI LINKKI`
    },
    deletePublicLink: {
        en: `DELETE THE SHARED LINK`,
        fi: `POISTA JAETTAVA LINKKI`
    },
    publicLinkURL: {
        en: `Shared link: `,
        fi: `Jaettava linkki:`
    },
    regeneratePublicLinkNote: {
        en: `Note! Regenerating the link will deactivate the current link.`,
        fi: `Huom. Uuden linkin luonti poistaa nykyisen linkin toiminnasta.`
    },
    deletePublicLinkBtn: {
        en: `DELETE THE CURRENT SHARED LINK`,
        fi: `POISTA NYKYINEN JAETTU LINKKI`
    },
    sharePublicLinkConfirmation: {
        en: `Are you sure you want to regenerate a shared link?`,
        fi: `Haluatko varmasti luoda uuden jaettavan linkin?`
    },
    sharePublicLinkConfirmationNote: {
        en: `The current link will stop working when you create a new one.`,
        fi: `Nykyinen linkki lakkaa toimimasta, kun luot uuden.`
    },
    deletePublicLinkConfirmation: {
        en: `Are you sure you want to delete the shared link?`,
        fi: `Haluatko varmasti poistaa jaettavan linkin?`,        
    },
    deletePublicLinkConfirmationNote: {
        en: `When you delete the shared link, the radar remains visible to the users who have been granted access to the radar in the user management.`,
        fi: `Poistettuasi jaetun linkin tämä kartta näkyy vain henkilöille, joille on käyttäjähallinnassa annettu sille pääsy.`
    },
    copyToClipboard: {
        en: `Copy to clipboard`,
        fi: `Kopioi leikepöydälle`
    },
    publicLinkCopied: {
        en: `Link copied.`,
        fi: `Linkki kopioitu.`
    },
    shareRadarFromUsrMngmt: {
        en: `You can invite users to this radar from the User management, or by creating a Shared link and share that in your network. If you choose to create a Shared link, please note, that anyone with the link can access the radar and collaborate on it.`,
        fi: `Voit kutsua kollegasi kartalle käyttäjähallinnasta tai tehdä jaettavan linkin ja jakaa sen verkostossasi. Huomaathan, että jakamaasi linkkiä klikkaamalla kuka tahansa voi päästä kartalle ja osallistua työskentelyyn.` 
    },
    publicLinkExisted : {
        en: `A shared link already exists for this radar. Click below to view it.`,
        fi: `Tälle kartalle on tehty jaettava linkki. Voit katsoa sen alta.`
    },
    checkPublicLinkAlreadyExisted: {
        en:`A shared link already exists for this radar. Click below to view it.`,
        fi:`Tälle kartalle on tehty jaettava linkki. Voit katsoa sen alta.`
    },
    goToManagement: {
        en:`OPEN THE USER MANAGEMENT`,
        fi:`AVAA KÄYTTÄJÄHALLINTA`
    },
    ok: {
        en:`OK`,
        fi:`OK`
    },
    sharedLinkDeletedNote: {
        en:`The shared link is now deleted from this radar.`,
        fi:`Jaettava linkki on nyt poistettu tältä kartalta.`
    },
    upvotesForHaloDescription: {
        en:`Sum of votes required for 'halo' effect`,
        fi:`Sädekehään vaadittava äänimäärä`
    },
    createFormDiscussionDescription: {
        en: ` Enable Discussion area in the Collaboration results section`,
        fi: ` Aktivoi keskustelupalsta tulosten yhteenvetonäkymässä`
    },
    verticalAxisName: {
        en:`Vertical axis name`,
        fi:`Pystyakselin nimi`
    },
    HorizontalAxisName: {
        en:`Horizontal axis name`,
        fi:`Vaaka-akseli`
    },
    IntructionsForNamingAxis: {
        en:`You can select the commonly used axis from the pulldown menu, and/or fill in the fields manually. `,
        fi:`You can select the commonly used axis from the pulldown menu, and/or fill in the fields manually. `
    },
    FlipHorizontalVertical: {
        en:`FLIP HORIZONTAL/VERTICAL`,
        fi:`VAIHDA VAAKA- JA PYSTYAKSELIT`
    },
    clearAllFieldsBtn: {
        en:`CLEAR ALL FIELDS`,
        fi:`TYHJENNÄ KAIKKI KENTÄT`
    },
    editManuallyBtn: {
        en:`EDIT MANUALLY`,
        fi:`MUOKKAA KÄSIN`
    },
    InfoIconHoverVoting: {
        en:`"More information on Voting"`,
        fi:`"Lisätietoja äänestämisestä"`
    },
    InfoIconHoverRating: {
        en:`"More information on Rating"`,
        fi:`"Lisätietoja arvioinnista"`
    },
    InfoIconHoverCommenting: {
        en:`"More information on Commenting"`,
        fi:`"Lisätietoja kommentoinnista"`
    },
    InfoIconHoverDiscussion: {
        en:`"More information on Discussion area"`,
        fi:`"Lisätietoja keskustelupalstasta"`
    },
    InfoModalVotingNote: {
        en: `The Voting tool enables voting of the content on the radar together with your team or with other stakeholders.`,
        fi:`Voit äänestää kartalla olevaa sisältöä yhdessä tiimisi kanssa tai osallistamalla muita sidosryhmiäsi.`
        
    },

    InfoModalVotingContent: {
        en:`
         After activating the Voting tool, anyone with access to the radar can vote on the content cards.`,
        fi:`
         Aktivoituasi äänestyksen kaikki, joilla on pääsy kartalle, voivat äänestää ennakointikartalla olevaa sisältöä.`
    },
    InfoModalVotingContent2: {
        en:`
         It activates ‘up’ and ‘down’ arrows on the top-right corner of Content cards.
        `,
        fi:`
         Äänestyksessä jokaisen sisältökortin oikeaan yläkulmaan ilmestyvät nuolet ylös- ja alaspäin.
        `
    },
    InfoModalVotingContent3: {
        en:`
         You are able to decide the voted question, e.g. prioritising the "10 most impactful" or "5 least important".`,
        fi:`
         Voit päättää kysymyksen asettelun osallistujille, esimerkiksi priorisoiden "10 vaikuttavinta" tai "5 vähiten tärkeintä".`
    },
    InfoModalVotingContent4: {
        en:`
         When the set threshold of votes for the 'halo' effect is reached, it displays a light circle around the content dot on the radar.`,
        fi:`
         Halutessasi voit määrittää rajan sille, kuinka monta ääntä sisältökortti tarvitsee, jotta se saa karttanäkymässä ympärilleen sädekehän.`
    },
    InfoModalVotingContent5: {
        en:`
          After the voting activity, results of the voting can be found by clicking the centre of the radar.`,
        fi:`
         Äänestyksen jälkeen löydät äänestyksen tulokset painamalla kartan keskustaa.`
    },
    InfoModalVotingContent6: {
        en:`
          A summary of votes can be exported from the results view.`,
        fi:`
         Äänestys-sivulta voit ladata äänestyksen yhteenvedon jatkohyödyntämistä varten.`
    },
    InfoModalVotingContent7: {
        en:`
         Remember to Save your settings after you have made changes. If you wish to discard the changes you made, click Cancel.
        `,
        fi:`
          Muistathan tallentaa tekemäsi valinnat. Mikäli haluat poistua tallentamatta, paina Peruuta.`
    },
    LearnMoreFromHUB: {
        en:`
         Learn more from the HUB:
        `,
        fi:`
          Lisätietoja HUBista (sisältö englanniksi):`
    },
    
    LearnMoreVotingBtn: {
        en:`How the Voting system works in Futures Platform?`,
        fi: `How the Voting system works in Futures Platform?`
    },
    GuideVotingBtn: {
        en:`How to organise a Voting session in practise, and why?`,
        fi: `How to organise a Voting session in practise, and why?`
    },
    InfoModalRatingNote: {
        en:`The Rating tool enables evaluation and assessment of the content on the radar via two axis, and displays the results in a fourfold table.`,
        fi: `Arviointityökalu mahdollistaa sisällön arvioinnin kahdella akselilla visualisoiden arvioinnin tulokset nelikentässä.
        `
    },
    InfoModalRatingContent: {
        en:`
         After activating the Rating tool, anyone with access to the radar can rate on the content cards.`,
        fi:`
         Aktivoituasi arvioinnin kaikki, joilla on pääsy kartalle, voivat arvioida ennakointikartalla olevaa sisältöä.`
    },
    InfoModalRatingContent2: {
        en:`
         Activating Rating tool activates two 'axis sliders' on each content card.`,
        fi:`
         Arvioinnissa jokaiselle sisältökortille ilmestyy kaksi liukusäädintä.`
    },
    InfoModalRatingContent3: {
        en:`
         Access some of the most commonly used axis from the dropdown menu, and/or fill in custom axis names manually.`,
        fi:`
         Voit hyödyntää pudostusvalikosta löytyviä usein käytettyjä akseleita ja/tai voit nimetä akselit vapaasti itse.`
    },
    InfoModalRatingContent4: {
        en:`
          After the rating activity, results can be found by clicking the centre of the radar.`,
        fi:`
         Arvioinnin jälkeen löydät arvioinnin tulokset painamalla kartan keskustaa.`
    },
    InfoModalRatingContent5: {
        en:`
         A summary of ratings can be exported from the results view.
        `,
        fi:`
         Arviointi-sivulta voit ladata arviointien yhteenvedon jatkohyödyntämistä varten.`
    },
    InfoModalRatingContent6: {
        en:`
         Remember to Save your settings after you have made changes. If you wish to discard the changes you made, click Cancel.
        `,
        fi:`
         Muistathan tallentaa tekemäsi valinnat. Mikäli haluat poistua tallentamatta, paina Peruuta.
        `
    },
    LearnMoreRatingBtn: {
        en:`How the Rating system works in Futures Platform?`,
        fi: `How the Rating system works in Futures Platform?`
    },
    GuideRatingBtn: {
        en:`How to organise a Rating session in practise, and why?`,
        fi: `How to organise a Rating session in practise, and why?`
    },
    InfoModalCommentingNote: {
        en:`The Commenting tool enables collection of insights, ideas and thoughts on the content cards. `,
        fi: `Kommentointi mahdollistaa havaintojen, ideoiden sekä ajatusten keräämisen sisältökorteille.`
    },
    InfoModalCommentingContent: {
        en:`
         After activating the Commenting tool, anyone with access to the radar can leave their comments on the content cards..
        `,
        fi: `
         Aktivoituasi kommentoinnin kaikki, joilla on pääsy kartalle, voivat kommentoida ennakointikartalla olevaa sisältöä.
        `
    },
    InfoModalCommentingContent2: {
        en:`
         It activates three commenting fields on the content cards: Opportunities, Threats and Actions.`,
        fi: `
         Kommentteja voi kirjoittaa kolmeen kenttään: Mahdollisuudet, Uhat ja Toimenpiteet.`
    },
    InfoModalCommentingContent3: {
        en:`
         All comments are gathered to the results view which you can access by clicking the centre of the radar.`,
        fi: `
         Kaikki kommentit koostetaan Kommentit-sivulle, jolle pääset painamalla kartan keskustaa.`
    },
    InfoModalCommentingContent4: {
        en:`
         A summary of comments can be exported from the results view.`,
        fi: `
          Kommentit-sivulta voit ladata kommenttien yhteenvedon jatkohyödyntämistä varten.`
    },
    LearnMoreCommentingBtn: {
        en:`How the Commenting system works in Futures Platform?`,
        fi: `How the Commenting system works in Futures Platform?`
    },
    GuideCommentingBtn: {
        en:`How to organise a Commenting session in practise, and why?`,
        fi: `How to organise a Commenting session in practise, and why?`
    },
    InfoModalDiscussionNote: {
        en:`Allow free conversation, ask for feedback, or collect other notes regarding the foresight radar / topic you are working with.`,
        fi: `Keskustelupalsta on paikka vapaalle keskustelulle, palautteen keräämiselle tai muiden havaintojen tallentamiselle.
        `
    },
    InfoModalDiscussionContent: {
        en:`
         Activate the discussion board on the Collaboration results view which you can access by clicking the centre of the radar.
        `,
        fi: `
         Voit aktivoida keskustelupalstan tulosten yhteenvetonäkymän vasempaan laitaan, johon pääset painamalla kartan keskustaa.
        `
    },
    InfoModalDiscussionContent2: {
        en:`
         The discussion area can be used to discuss on Voting, Rating and Commenting results, or to collect any other kind of notes regarding the radar.`,
        fi: `
         Keskustelupalstalla voi keskustella äänestämisen, arvioinnin tai kommentoinnin tuloksista, ja siihen voi kerätä vapaasti kommentteja ja ajatuksia.`
    },
    InfoModalDiscussionContent3: {
        en:`        
         The discussion on the Discussion area can be exported from the results view.`,
        fi: `
         Tulosten yhteenvetonäkymästä voit ladata keskustelut jatkohyödyntämistä varten.`
    },
    LearnMoreDiscussionBtn: {
        en:`How the Discussion area works in Futures Platform?`,
        fi: `How the Discussion area works in Futures Platform?`
    },
    GuideDiscussionBtn: {
        en:`How to organise a Discussion in practise, and why?`,
        fi: `How to organise a Discussion in practise, and why?`
    },
    commenting: {
        en:`Commenting`,
        fi: `Kommentointi`
    },
    CommentingTool: {
        en:`Commenting tool`,
        fi: `Kommentointi`
    },
    RatingTool: {
        en:`Rating tool`,
        fi: `Arviointi`
    },
    VotingTool: {
        en:`Voting tool`,
        fi: `Äänestys`
    },
    DiscussionAreaTool: {
        en:`Discussion area`,
        fi: `Keskustelupalsta`
    },
    discussion: {
        en: `Discussion area`,
        fi: `Keskustelupalsta`
    },
    activateUsers: {
        en:`Collaboration tools`,
        fi: `Toiminnot`
    },
    createFormVotingDescription: {
        en:`Enable Voting on Content cards`,
        fi: `Salli äänestys sisältökorteilla`
    },
    upvotesForHalo: {
        en:`Enable 'halo' effect on the Radar`,
        fi: `Salli sädekehät karttanäkymässä`
    },
    createFormRatingDescription: {
        en:`Enable two axis Rating on Content cards (fourfold table)`,
        fi: `Aktivoi arviointi sisältökorteilla (nelikenttä)`
    },
    selectValue: {
        en:`Select...`,
        fi: `Valitse...`
    },
    manualEditLeftEnd: {
        en:`Horizontal axis – Left end`,
        fi: `Vaaka-akseli – vasen`
    },
    manualEditRightEnd: {
        en:`Horizontal axis – Right end`,
        fi: `Vaaka-akseli – oikea`
    },
    manualEditLowEnd: {
        en:`Vertical axis – Low end`,
        fi: `Pystyakseli – ala`
    },
    manualEditHighEnd: {
        en:`Vertical axis – High end`,
        fi: `Pystyakseli –  ylä`
    },
    manualEditTopLeft: {
        en:`Fourfold table – top left`,
        fi: `Nelikenttä – vasen yläosa`
    },
    manualEditTopRight: {
        en:`Fourfold table – top right`,
        fi: `Nelikenttä – oikea yläosa`
    },
    manualEditBottomLeft: {
        en:`Fourfold table – bottom left`,
        fi: `Nelikenttä – vasen alaosa`
    },
    manualEditBottomRight: {
        en:`Fourfold table – bottom right`,
        fi: `Nelikenttä – oikea alaosa`
    },
    createFormCommentingDescription: {
        en:`Enable Commenting on Content cards`,
        fi: `Aktivoi kommentointikentät sisältökorteilla`
    },
    allowLikeCommenting: {
        en:`Enable Liking other users’ comments`,
        fi: `Salli käyttäjien tykätä toistensa kommenteista`
    },
    GotItBtn: {
        en:`GOT IT`,
        fi: `OK`
    },
    DoneBtn: {
        en:`DONE`,
        fi: `VALMIS`
    },
    ConfirmationClearAllModal: {
        en:`Are you sure to clear all fields ?`,
        fi: `Haluatko varmasti tyhjentää kaikki kentät ?`
    },
    max20Chars: {
        en: `(max. 20 characters)`,
        fi: `(Enintään 20 merkkiä)`
    }
    
    
}

initTranslations(localTranslations);
