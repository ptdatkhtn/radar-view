import { initTranslations } from '@sangre-fp/i18n'

const localTranslations = {
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
        en: `You're about to permanently delete this timerange and all of it's data. Are you sure you want to continue ?`,
        fi: `Olet poistamassa aikakehää ja sen kuvausta. Ilmiöt jakautuvat kartalle uuden jaon mukaisesti. Oletko varma, että haluat jatkaa?`
    },
    addTimelineButton: {
        en: `+ ADD NEW RANGE`,
        fi: `+ LISÄÄ UUSI KEHÄ`
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
        en: 'Filter phenomena',
        fi: 'Suodata sisältöä'
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
    }
}

initTranslations(localTranslations);
