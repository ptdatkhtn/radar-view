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
        en:`Sum of votes required for 'halo' effect:`,
        fi:`Sädekehään vaadittava äänimäärä:`
    },
    createFormDiscussionDescription: {
        en: ` Enable Discussion area in the Collaboration results section.`,
        fi: ` Enable Discussion area in the Collaboration results section.`
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
    InfoIconHover: {
        en:`Click for more info.`,
        fi:`Avaa lisätiedot klikkaamalla.`
    },
    InfoModalVotingNote: {
        en: `The Voting tool enables prioritisation of the radar content together with your team.`,
        fi:`The Voting tool enables prioritisation of the radar content together with your team.`
        
    },

    InfoModalVotingContent: {
        en:`
        • It activates ‘up’ and ‘down’ arrows on the top-right corner of Content cards`,
        fi:`
        • It activates ‘up’ and ‘down’ arrows on the top-right corner of Content cards`
    },
    InfoModalVotingContent2: {
        en:`
        • The 'halo' effect can be activated to display a light circle around the content dot on the radar screen, when the set threshold is reached.`,
        fi:`
        • The 'halo' effect can be activated to display a light circle around the content dot on the radar screen, when the set threshold is reached.`
    },
    InfoModalVotingContent3: {
        en:`
        • Voting summary can be found from the radar centre`,
        fi:`
        • Voting summary can be found from the radar centre`
    },
    InfoModalVotingContent4: {
        en:`
        • Remember to Save your settings!`,
        fi:`
        • Remember to Save your settings!`
    },
    InfoModalVotingContent5: {
        en:`
        • If you wish to discard the changes you made, click Cancel`,
        fi:`
        • If you wish to discard the changes you made, click Cancel`
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
        en:`The Rating tool enables evaluation of the radar content by two axis, and displays the results in a fourfold table.`,
        fi: `The Rating tool enables evaluation of the radar content by two axis, and displays the results in a fourfold table.`
    },
    InfoModalRatingContent: {
        en:`
        • It activates the 'axis sliders' on each content card`,
        fi:`
        • It activates the 'axis sliders' on each content card`
    },
    InfoModalRatingContent2: {
        en:`
        • Easily select some of the commonly used axis from the dropdown menu, and/or fill in any custom values manually`,
        fi:`
        • Easily select some of the commonly used axis from the dropdown menu, and/or fill in any custom values manually`
    },
    InfoModalRatingContent3: {
        en:`
        • Rating summary can be found from the radar centre`,
        fi:`
        • Rating summary can be found from the radar centre`
    },
    InfoModalRatingContent4: {
        en:`
        • Remember to Save your settings!`,
        fi:`
        • Remember to Save your settings!`
    },
    InfoModalRatingContent5: {
        en:`
        • If you wish to discard the changes you made, click Cancel`,
        fi:`
        • If you wish to discard the changes you made, click Cancel`
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
        en:`The Commenting tool enables all team members to leave their notes on the radar content. `,
        fi: `The Commenting tool enables all team members to leave their notes on the radar content. `
    },
    InfoModalCommentingContent: {
        en:`
        • It activates three commenting fields on the content cards: Opportunities, Threats and Actions.
        `,
        fi: `
        • It activates three commenting fields on the content cards: Opportunities, Threats and Actions.
        `
    },
    InfoModalCommentingContent2: {
        en:`
        • All comments are gathered to the summary views that you can access by clicking the radar centre.`,
        fi: `
        • All comments are gathered to the summary views that you can access by clicking the radar centre.`
    },
    InfoModalCommentingContent3: {
        en:`
        • A summary of content specific comments can be exported.`,
        fi: `
        • A summary of content specific comments can be exported.`
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
        en:`The Discussion area allows free conversation, collecting feedback, or e.g. easily collecting participant answers during a foresight workshop.`,
        fi: `The Discussion area allows free conversation, collecting feedback, or e.g. easily collecting participant answers during a foresight workshop.`
    },
    InfoModalDiscussionContent: {
        en:`
        • It activates the discussion board on the Collaboration results view. 
        `,
        fi: `
        • It activates the discussion board on the Collaboration results view. 
        `
    },
    InfoModalDiscussionContent2: {
        en:`
        • Can be used to discuss on Voting, Rating and Commenting results.`,
        fi: `
        • Can be used to discuss on Voting, Rating and Commenting results.`
    },
    InfoModalDiscussionContent3: {
        en:`        
        • The Discussion area can be exported as PDF / PPT summary.`,
        fi: `
        • The Discussion area can be exported as PDF / PPT summary.`
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
        fi: `Commenting tool`
    },
    RatingTool: {
        en:`Rating tool`,
        fi: `Rating tool`
    },
    VotingTool: {
        en:`Voting tool`,
        fi: `Voting tool`
    },
    activateUsers: {
        en:`Collaboration tools`,
        fi: `Aktiviteetit`
    },
    createFormVotingDescription: {
        en:`Enable Voting on Content cards.`,
        fi: `Salli äänestys sisältökorteilla.`
    },
    upvotesForHalo: {
        en:`Enable 'halo' effect on Radar screen.`,
        fi: `Salli sädekehät karttanäkymässä.`
    },
    createFormRatingDescription: {
        en:`Enable two axis Rating on Content cards (fourfold table).`,
        fi: `Aktivoi arviointiakselit sisältökorteilla (nelikenttä).`
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
        en:`Enable Commenting on Content cards.`,
        fi: `Aktivoi kommentointikentät sisältökorteilla.`
    },
    allowLikeCommenting: {
        en:`Enable Liking other users’ comments.`,
        fi: `Salli käyttäjien tykätä toistensa kommenteista.`
    }
   
    
    
}

initTranslations(localTranslations);
