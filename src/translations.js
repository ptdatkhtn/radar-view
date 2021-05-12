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
    }
}

initTranslations(localTranslations);
