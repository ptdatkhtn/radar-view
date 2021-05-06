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
    publicLink: {
        en: `CREATE A PUBLIC LINK`,
        fi: `NÄYTÄ JAETTAVA LINKKI`
    },
    createPublicLink: {
        en: `Create a Shared Collaboration Link`,
        fi: `Luo jaettu yhteistyölinkki`
    },
    publicLinkNote: {
        en: `Copy the link and share it in your network. Anyone with the link can access this radar`,
        fi: `Kopioi linkki ja jaa se verkostossasi. Otathan huomioon, että linkkiä klikkaamalla kuka tahansa pääsee tälle kartalle.`
    },
    regeneratePublicLink: {
        en: `REGENERATE LINK`,
        fi: `LUO UUSI LINKKI`
    },
    publicLinkURL: {
        en: `Shared Collaboration Link: `,
        fi: `Jaettu yhteistyölinkki:`
    },
    regeneratePublicLinkNote: {
        en: `NOTE! Regenerating the URL will deactivate the previous link`,
        fi: `HUOM. Uuden linkin luonti poistaa nykyisen linkin toiminnasta.`
    },
    deletePublicLink: {
        en: `Delete the public link`,
        fi: `Poista julkinen linkki`
    },
    sharePublicLinkConfirmation: {
        en: `Are you sure you want to make a new public link?`,
        fi: `Oletko varma, että haluat tehdä uuden linkin?`
    },
    sharePublicLinkConfirmationNote: {
        en: `The old link will stop working when you create a new one.`,
        fi: `Vanha linkki lakkaa toimimasta, kun luot uuden.`
    },
    deletePublicLinkConfirmation: {
        en: `Are you sure you want to remove this public link?`,
        fi: `Haluatko varmasti poistaa tämän julkisen linkin?`,        
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
        en: `You can invite users to this radar from the User management, or create a Shared collaboration link (public link) and share it in your network.`,
        fi: `Voit kutsua kollegasi kartalle käyttäjähallinnasta tai tehdä julkisen linkin ja jakaa sen verkostossasi.` 
    },
    publicLinkExisted : {
        en: `A shared link already exists for this radar. Click below to view it.`,
        fi: `Tälle kartalle on tehty jaettava linkki. Voit katsoa sen alta.`
    },
    showThePublicLink: {
        en: `SHOW THE SHARED LINK`,
        fi: `NÄYTÄ JULKINEN LINKKI`
    }
}

initTranslations(localTranslations);
