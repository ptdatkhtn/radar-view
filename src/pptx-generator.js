import PptxGenJS from 'pptxgenjs'
import { requestTranslation as tr } from '@sangre-fp/i18n'
import radarDataApi from '@sangre-fp/connectors/radar-data-api'
import { getPhenomenaTypes, getRadar } from '@sangre-fp/connectors/drupal-api'
import { getUsername } from '@sangre-fp/connectors/session'
import htmlToText from 'html-to-text'
import { getRadarPhenomena } from '@sangre-fp/connectors/phenomena-api'
import { get } from 'lodash'
import { screenshot } from '@sangre-fp/connectors/screenshot-service-api'
export default async function generatePPTX(radarId, groupId) {
  const pptx = new PptxGenJS()
  const username = getUsername()
  const reportCreatedDate = new Date()
  const createdDate = reportCreatedDate.toLocaleDateString()
  const phenomenonTypes = await getPhenomenaTypes(groupId)
  const phenomenonTypeTitlesById = phenomenonTypes.reduce((obj, { id, title }) => ({ ...obj, [id]: title }), {})
  const { radarName, results_url: radarResultsUrl, url: radarUrl, phenomena: radarPhenomenaDataById, axisXTitle, axisYTitle, comment_count, ratingsOn, votingOn, discussionOn, commentsOn } = await getRadar(radarId)
  const { data: { sectors } } = await radarDataApi.getRadar(radarId)
  const { phenomena: radarPhenomena } = await getRadarPhenomena(radarId, groupId)
  let phenomena = radarPhenomena.map(p => ({ ...radarPhenomenaDataById[p.id], ...p })).sort(({ time: aTime }, { time: bTime }) => aTime - bTime)
  pptx.defineLayout({ name: 'FP', width: 13.33, height: 7.5 });
  pptx.layout = 'FP';
  pptx.defineSlideMaster({
    title: "FP_SLIDE",
    // slideNumber: { x: 10, y: 7.8, color: '000000' },
    objects: [
      {
        image: {
          x: 0.37,
          y: 7.02,
          w: 2.17,
          h: 0.32,
          data: getFuturesPlatformLogo()
        },
      },
      {
        text: {
          text: `${createdDate}  ${tr('pptxReportBy')} ${username}`, options: { x: 4, y: 7.04, w: 9.0, h: 0.3, fontSize:12, align: 'right' }
        }
      }
    ]
  })

  function addHeading(txt, slide) {
    slide.addText(txt, { x: 0.4, y: 0.4, fontSize: 18, valign: "top", w: 12, h: 0.4 })
  }

  function addTitle(txt, slide) {
    slide.addText(txt, { x: 0.4, y: 0.68, fontSize: 25, color: '44546a', bold: true, valign: "top", w: 12, h: 0.5 })
  }

  function addSlide(opts = {}) {
    return pptx.addSlide(Object.assign({
      masterName: "FP_SLIDE",
      fontFace: 'Arial',
      fontSize: 12
    }, opts))
  }

  function addCoverSlide() {
    const slide = addSlide({
      masterName: undefined
    })
    // Radar Title
    slide.addText(radarName, { x: 0.16, y: 2.57, w: 13, h: 1.63, autoShrink: true, align: 'center', bold: true, fontSize: 50 })
    // Content Summary Text
    slide.addText([
      { text: `${tr('pptxReportTitle')} `, options: { bold: true, breakLine: false } },
      { text: createdDate, options: { breakLine: false } },
      { text: ` ${tr('pptxReportBy')} `, options: { bold: true, breakLine: false } },
      { text: username, options: { breakLine: false } },
    ], { x: 0.16, y: 4.24, w: 13, h: 2, fontSize: 20, align: 'center', color: '44546a' })
    slide.addImage({
      x: 4.7,
      y: 6.5,
      w: 3.92,
      h: 0.59,
      data: getFuturesPlatformLogo()
    })
  }

  async function addPreviewSlide() {
    const slide = addSlide({ masterName: undefined })
    try {
      const { data } = await screenshot({ url: radarUrl, waitFor: 5000 })
      slide.addImage({
        data: `image/png;base64,${data}`,
        x: 0,
        y: 0,
        w: 13.33,
        h: 7.5
      })
    } catch (err) {
      console.error('radar preview screenshot failed')
    }
  }

  function addSectorsSlide() {
    const slide = addSlide()
    addHeading(radarName, slide)
    addTitle(tr('pptxSectorListTitle'), slide)
    slide.addText(sectors.map(({title}) => ({
      text: title, options: { bullet: true }
    })), { x: 0.4, y: 1.2, fontSize: 15, lineSpacing: 25, valign:"top", w: 12, h: 5 })
  }

  function addSectorSummarySlide({ title, notes }) {
    const slide = addSlide()
    addHeading(tr('pptxSector').toUpperCase(), slide)
    addTitle(title, slide)
    slide.addText(toText(notes), { x: 0.4, y: 1.2, w: 11.5, h: 6, fontSize: 12, isTextBox: true, shrinkText: true, valign: 'top' })
  }

  function addSectorContent(id, title, phenomena) {
    const slide = addSlide()
    addHeading(tr('pptxSectorContent').toUpperCase(), slide)
    addTitle(title, slide)
    let xOffset = 0
    // TODO: Replace time with crowdsourced
    phenomena.forEach(({ content: { short_title, type, summary, time_range }, time }) => {
      const yearMin = time_range?.min
      const yearMax = time_range?.max
      let timeRangeStr = ''
      if (yearMin || yearMax) {
        timeRangeStr = `${yearMin}-${yearMax}`
      }

      slide.addText(short_title, { x: 0.4 + xOffset, y: 1.2, w: 3.9, h: 0.3, isTextBox: true, shrinkText: true, bold: true, fontSize: 15 })
      slide.addText(`${phenomenonTypeTitlesById[type]} ${timeRangeStr}`, { x: 0.4 + xOffset, y: 1.4, w: 3.9, h: 0.3, shrinkText: true, fontSize: 10 })
      slide.addText(`${tr('pptxTimestamp')}: ${Math.trunc(time) || '-'}`, { x: 0.4 + xOffset, y: 1.6, w: 3.9,  h: 0.3, shrinkText: true, fontSize: 10 })
      slide.addText(toText(summary), { x: 0.4 + xOffset, y: 1.9, w: 3.9, h: 5, isTextBox: true, shrinkText: true, valign: 'top', fontSize: 12 })
      xOffset += 4
    })

  }

  function addTopVotedContentSlide(phenomena, pageNum, totalCount) {
    const slide = addSlide()
    addHeading(radarName, slide)
    addTitle(tr('pptxTopVotedContent'), slide)
    const rows = phenomena.map(({ content: { short_title, type }, vote_sum }) => (
      [
        { text: short_title, options: { bold: true } },
        { text: `${phenomenonTypeTitlesById[type]}` },
        { text: typeof vote_sum === 'number' ? vote_sum : '-' }
      ]
    ))
    slide.addTable(rows, { x: 0.5, y: 1.3, w: 12, h: 5, colW: [8, 1.5, 1.5], valign: 'top' })
  }

  async function addRatedContentImageSlide() {
    const slide = addSlide()
    addHeading(radarName, slide)
    addTitle(tr('pptxRatedContent'), slide)

    try {
      const { data } = await screenshot({ waitFor: 5000, url: `${radarResultsUrl}?tab=1`, selector: 'div.rating-results-diagram' })
      slide.addImage({
        data: `image/png;base64,${data}`,
        x: 0.4,
        y: 1.4,
        w: 7.1,
        h: 5.3
      })
    } catch (err) {
      console.error('rating results diagram screenshot failed')
    }
  }

  function addRatedContentAxisSlide(xPhenomena, yPhenomena) {
    const slide = addSlide()
    addHeading(radarName, slide)
    addTitle(tr('pptxRatedContent'), slide)

    let xOffset = 0.4;
    [xPhenomena, yPhenomena].forEach(({ title, axis, phenomena }) => {
      slide.addText(title, { x: xOffset, y: 1.4, fontSize: 18, w: 13, h: 0.35, bold: true })
      const rows = phenomena.map(({ content: { short_title, type }, rating_avg }) => {
        return [
          { text: short_title, options: { bold: true } },
          { text: `${phenomenonTypeTitlesById[type]}` },
          { text: rating_avg && typeof rating_avg[axis] === 'number' ? (rating_avg[axis] / 100).toFixed(2) : '-' }
        ]

        }
      )
      if (rows.length > 0) {
        slide.addTable(rows, { x: xOffset, y: 2, w: 5.5, h: 4.7, colW: [3.5, 1.5, 0.5], valign: 'top' })
      }
      xOffset += 6.8
    })
  }

  function addCommentSummarySlide() {
    const slide = addSlide()
    addHeading(radarName, slide)
    addTitle(tr('pptxCommentsTitle'), slide)

    slide.addText([
      {text: tr('pptxCommentsText', comment_count) , options: { breakLine: false }},
      {text: `${radarResultsUrl}?tab=2`, options: { hyperlink: {url: `${radarResultsUrl}?tab=2` }}}
    ], { x: 0.4, y: 2 })
  }

  addCoverSlide()
  await addPreviewSlide()

  // Sectors
  addSectorsSlide()
  sectors.forEach(function (sector) {
    addSectorSummarySlide(sector)
    let sectorPhenomena = phenomena.filter(({ sectorId }) => sectorId === sector.id)
    do {
      addSectorContent(sector.id, sector.title, sectorPhenomena.splice(0, 3))
    } while (sectorPhenomena.length > 0)
  })

  // Top Voted Phenomena
  if (votingOn) {
    const sortedPhenomena = [...phenomena].sort(({ vote_sum: aVoteSum = -1000000, time: aTimestamp }, { vote_sum: bVoteSum = -1000000, time: bTimestamp }) => {
      if (aVoteSum === bVoteSum) {
        return aTimestamp-bTimestamp
      }
      return bVoteSum-aVoteSum
    })

    const topVotedPageCount = Math.ceil(sortedPhenomena.length % 15)
    let topVotedPageNum = 1
    do {
      addTopVotedContentSlide(sortedPhenomena.splice(0, 15), topVotedPageCount, topVotedPageNum++, topVotedPageCount)
    } while (sortedPhenomena.length > 0)
  }

  // Content Rating
  if (ratingsOn) {
    await addRatedContentImageSlide()

    const axisPhenomena = ['x', 'y'].map(axis => [...phenomena].sort(({ rating_avg: aRatingAvg }, { rating_avg: bRatingAvg }) => {
      let aAvg = get(aRatingAvg, axis, -10000000)
      let bAvg = get(bRatingAvg, axis, -10000000)
      return bAvg-aAvg
    }))
    let xPhenomena = axisPhenomena[0] || []
    let yPhenomena = axisPhenomena[1] || []
    do {
      addRatedContentAxisSlide({ title: axisXTitle, axis: 'x', phenomena: xPhenomena.length > 0 ? xPhenomena.splice(0, 14) : [] }, { title: axisYTitle, axis: 'y', phenomena: yPhenomena.length > 0 ? yPhenomena.splice(0, 14) : [] })
    } while (xPhenomena.length > 0 || yPhenomena.length > 0)
  }

  if (discussionOn || commentsOn) {
    // Comment Summary Slide
    addCommentSummarySlide()
  }
  return pptx.writeFile(radarName.replace(/(\W+)/gi, '-'));
}

function toText(html) {
  return htmlToText.fromString(html, { wordwrap: false, ignoreImage: true, singleNewLineParagraphs: false }).replace("\r", '').replace(/\n\n+/g, "\n\n")
}

function getFuturesPlatformLogo() {
  return 'image/wmf;base64,AQAAAGwAAAAAAAAAAAAAAKMEAACyAAAAAAAAAAAAAADCdQAAjxEAACBFTUYAAAEArC8AAP0AAAACAAAAAAAAAAAAAAAAAAAA7AQAALEDAABAAQAA8AAAAAAAAAAAAAAAAAAAAADiBACAqQMARgAAAKwZAACeGQAAR0RJQwQAAEAAAAAAAAAAAKMEAACyAAAAAQAAACBGRFABAAAAchkAACwAAAAlUERGLTEuMwolxOXy5eun86DQxMYKNCAwIG9iago8PCAvTGVuZ3RoIDUgMCBSIC9GaWx0ZXIgL0ZsYXRlRGVjb2RlID4+CnN0cmVhbQp4AW2ZSY7YyBFF9zxFXsDsnId1L7zulQ9QsNwLlYG27g/4/SQjSLUKBWj4zCHGHxFZf4U/wl8hhnimEntqOczWzrRqDynP8L9/h3+F/4bffv+RwscPrePnx0f47Z8A//kR0mjnSr2HMc7V55jH54P1efaWUwrfQ1rxrJwavsLaOutoaWidnWfY8cIK5yVu0brezpJGD19hc5x5lpz3venssa5gmM5bN2Yys+7P8C3kms824wptnGmmMsLng/FtZNCQSzljHjWUcfbaajlyzmfFeI6Ej4DW5yzpheWYkSrm8JxkiN13sM+wLW9uHdlyyucc41LhZ6jNM6aBr55VdZ0zpTmOnMaJR0PteKYWJDc5HeG+PM6xxnqtKulcM4HcB6HxhRx+G/ts1VtOs98L23Yd5ZxrNY+R8Hlkw17+y72cJcb29qljL1/lVs5RV/Lz8Klj5mdZZJaztuKuf0Gv0yRhKZUonsU9TxQ75v4qmZjrdT5+Lqmeg3i0UMDxJdYz9eXQkVclanGfn+OI+V3xYqtetiuxnTnV5o5HT8fcFy/MPVbiOsua9fGqSWquJ9RKVs6396JcSapVHtcXQ/w67btXmagSywxoGLbehu0ybJqBdF01kv8YdsSzZ4RzrIwMUcQicpgd6x2ODIVeJ8C511ZBESmNKRvfJw3SAM/kwB/XfYZIzx7PluYMhiGbYy6D5BU6MsnQ+tlXy03S2m7DpK1hCt4c2QCG8ReU8wW0bVJL2fc2snNAsqIoMJ2GXC3e6a1lhbgtc5Qw8GJrSyRnyMschvXOUSuVo0w4tgeEy2XBpoUcywOOJM5m7JyMMSZZPQrs9RIdg842COMbQyg5r6aI0xJy3NyOORzDVW2WIuap5EWtm9r/DonFI47hRN9pmHbaDZUbSk1i7JoxfkbprzBJqAqg82I8S80yl1cFx7Z5rwrg532FmWamMeE2M8SyzjEa5IvCREhSTGDMMgYxxtUQVa5QK4Yrq2DYitHLZAO+nINkPipVFHLFeDeC8Wuj8AwKhWNVKSvTI0gmAZ7/E8dj9hw+jgcjSxLEu8+ZsHZA3Eo6TpB6tkKlJSMidVb5UjvlrEI8aDBHvJyA29IaLfBtVZXSqgzr7CRIKPpUygfRF9ZylC2qFcXXzIfMMtqrCiJCI4yhkxcZEhVQzEOGofKRdJYK6J1UDQvuHrMddRLsFQ7mugpxVwoBWs05yUNszlGjdyg6Y2lWbFs1whpF7wInETgP4xsim5NEVRcZhuMQlFTF9hkVRIA3gn9M4xs6JAIJKxMvyinBsYmgVAidb6DQBV+aiqhEx904KbAfB+IsiU79njkfCqWIm1AaoUjN0NmpgHBgoGVMVSfZmonbl9REA3qSOZG6LFxgEWaINhGZ4PDLvQoEu4rloYtGHLftzJ+C/OP4FlrCn2JQZDSibioQraUH+471FUy41NdxKNW9QfFG3o4oam7yfjAjbz+JZLjI2+8zBPJ2uQzDnn8iRZIvutMoidroy4Y426gVBGbAzM6jx4O8JLNVlA7cW5+DjPGf6xz5OFwwxzCOGVFH3nWBlKAfUKJ8gZmoN/001TPxykV9BBRqGXbth7m5h++9kJlfYMdFc1RH1lG1c+m3SaD+N+Z3XGTfaTwjXYLcuPJk7edBTJOT9LwEemy5qPHukXwV778wHKL2pZAK5HVeebfObYl/1B1tgs4VLRvBnBqtm2GSiFvEKXebAxlet1Qqwk8YTqert/ZwnwdxqfQ8d+y9KpvUP5fl1pD8IT7qu5xh7Y1RO72I9EIK5H557B43HLOCoXsoVDjhaUNf2O2FPYJ0IkQ9wqv+GPQ6TQUXHmTwUF15Cq5hB36xYapj2Q4xvocpx1Re72HK9oqg/o79pHEfFPNhXtkDVjfsLfaikRdhfoEdLvNl7ZGUjnTfqjT0dur8HKOBJ664Z6R5VuYuRTzRJ2Oq/GuqcuSD0gsJD0WXr4IcOZxq4CcZ4vdp37XqoHMkEhHcT8LSKAyP2X1XTRbCPpPqWXVr8zrpF/3Y10SYEcJ86WwYhSFPVe9RVaNjpcm9st1FMEAS0GEwVRsyYuFkFQE/xRC7C7L0VfgC/mlod5+zywG16lHXEbbdAl1Fg1WHK/IcZGrYdZjpG3FK29Hl5KdqDLpQWtunahyDpNfbglcIbH0jrwrxYFYh/CTjfmLsvs8QOQuCZARmurQ68v3BXC4FpVbSSUNdhJjae6Y8320YSezYRa+kLhgp1IjnN407ttPhauZpG0m1dzfPXmydmHiutFGHP0ikSAvjDb4Dd12SM+811t4DoCgD29Pgy2S7/Xw1+KQJjKYB9K43sC7tFRMQihuGQuIb2qhzkVYXTPf96RAZQ1eo7n5Ch02t7W6OYCcOnNT8VOeDaR3PDUwZ5Niz1SC/gGVRne6eaRSjSaOBYxevdD0E0aEwya27KpQL49GhFMo+bqW6qLci0JAuGyX1oePUia7b3PfOG3oJIgPo2UtTBwMiEvGsRadP20aS0gzoPSzrOcuwPE8snlfAxLkwaeEPOCuq24PsYMb2gpjpd+c1X+DxD+6LuQ8GYT/thdmthPUL5brKuLu30MpxIC9zDCVrHH6vIew06RxyBfwgR54L6QHT/sEKzIg9N+oLbANvwkOfgeBjyCTV6ZrpMHkkoAiNSF+rVTw2EPNEbJurd3F3IuLVy9MY0E3Q0nR6X81D6hSYkNhGU8ErTtJBs8fIdXrnSho4eKGDg5hpgVJTv8n9eSluNhJpqJAy8yzGNpIJJ2gfAURvrJae1nwWVV0IM+FiRKJepH78qtxmMu7pCM9ICilXdP8MZB5a6TA1HoX2h7gjmUkuwimVEqdaeioT+1Qu+ZuBbZPhnlBgQl5E6b/4SGsqaTrtSsZ4EF9eE72Qj1mf5zoynurKvJWkGWeq++FhsUcsIl3boJ0AYTUUIqRQUC4T905+66xKWhyKAJp0VhPY+03XET0J5IKvrjjZq+gScSRTiHxMqZ6aBSsPIfNgaMBZ1GemLsZG8kyEKy9p6KXPKjwyCGm8MNJxmfHggJ/NiXr0N3TtqcNDE9cjYZKReWNg3CdboW+6QPpv/sFouRGYi/NpNZl2t13imFW2gowmDcO2A80eXSFx0RkQd1y0jCFFa2hB0eToyaf9iKQZGupSpDDqFZ6adqjpBZt71SUFEIKfPMdtVBZUBuGpAocgyVo50htSwBYekcqLxxaeIai5zGkMnxhB3Yb24fdYaAgcE8JDB+LKVHh5r9led4R9cPgqQ0fxooIqVGgsgbpoWebcll5MjtyPh+gmFAd7au7MOzS+jMjwBFnQokY+VEPYpMGYFkRDDtw1CVJtw43YmaDGK2M/BXBtXuS6wjyTvvoEvXGSXgkkiFzAgxdUycTAwzaMdoUNskCH2AKu4AAig98pUBRQF/rglwgbW4vhl2LOYFSa3pUZVSDUodkCiykGSAA1S0QiGSc5iRSeQpQMeuaK5I7iqXTiVe0E03g/fo0wxd0f/wcLA/OCCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iagoyNjIzCmVuZG9iagoyIDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMyAwIFIgL1Jlc291cmNlcyA2IDAgUiAvQ29udGVudHMgNCAwIFIgL01lZGlhQm94IFswIDAgODU1LjE5NDYgMTI4LjI2MTNdCj4+CmVuZG9iago2IDAgb2JqCjw8IC9Qcm9jU2V0IFsgL1BERiBdIC9Db2xvclNwYWNlIDw8IC9DczEgNyAwIFIgPj4gL0V4dEdTdGF0ZSA8PCAvR3MxIDggMCBSCj4+ID4+CmVuZG9iago4IDAgb2JqCjw8IC9UeXBlIC9FeHRHU3RhdGUgL09QTSAxID4+CmVuZG9iago5IDAgb2JqCjw8IC9MZW5ndGggMTAgMCBSIC9OIDMgL0FsdGVybmF0ZSAvRGV2aWNlUkdCIC9GaWx0ZXIgL0ZsYXRlRGVjb2RlID4+CnN0cmVhbQp4AZ2Wd1RT2RaHz703vdASIiAl9Bp6CSDSO0gVBFGJSYBQAoaEJnZEBUYUESlWZFTAAUeHImNFFAuDgmLXCfIQUMbBUURF5d2MawnvrTXz3pr9x1nf2ee319ln733XugBQ/IIEwnRYAYA0oVgU7uvBXBITy8T3AhgQAQ5YAcDhZmYER/hEAtT8vT2ZmahIxrP27i6AZLvbLL9QJnPW/3+RIjdDJAYACkXVNjx+JhflApRTs8UZMv8EyvSVKTKGMTIWoQmirCLjxK9s9qfmK7vJmJcm5KEaWc4ZvDSejLtQ3pol4aOMBKFcmCXgZ6N8B2W9VEmaAOX3KNPT+JxMADAUmV/M5yahbIkyRRQZ7onyAgAIlMQ5vHIOi/k5aJ4AeKZn5IoEiUliphHXmGnl6Mhm+vGzU/liMSuUw03hiHhMz/S0DI4wF4Cvb5ZFASVZbZloke2tHO3tWdbmaPm/2d8eflP9Pch6+1XxJuzPnkGMnlnfbOysL70WAPYkWpsds76VVQC0bQZA5eGsT+8gAPIFALTenPMehmxeksTiDCcLi+zsbHMBn2suK+g3+5+Cb8q/hjn3mcvu+1Y7phc/gSNJFTNlReWmp6ZLRMzMDA6Xz2T99xD/48A5ac3Jwyycn8AX8YXoVVHolAmEiWi7hTyBWJAuZAqEf9Xhfxg2JwcZfp1rFGh1XwB9hTlQuEkHyG89AEMjAyRuP3oCfetbEDEKyL68aK2Rr3OPMnr+5/ofC1yKbuFMQSJT5vYMj2RyJaIsGaPfhGzBAhKQB3SgCjSBLjACLGANHIAzcAPeIACEgEgQA5YDLkgCaUAEskE+2AAKQTHYAXaDanAA1IF60AROgjZwBlwEV8ANcAsMgEdACobBSzAB3oFpCILwEBWiQaqQFqQPmULWEBtaCHlDQVA4FAPFQ4mQEJJA+dAmqBgqg6qhQ1A99CN0GroIXYP6oAfQIDQG/QF9hBGYAtNhDdgAtoDZsDscCEfCy+BEeBWcBxfA2+FKuBY+DrfCF+Eb8AAshV/CkwhAyAgD0UZYCBvxREKQWCQBESFrkSKkAqlFmpAOpBu5jUiRceQDBoehYZgYFsYZ44dZjOFiVmHWYkow1ZhjmFZMF+Y2ZhAzgfmCpWLVsaZYJ6w/dgk2EZuNLcRWYI9gW7CXsQPYYew7HA7HwBniHHB+uBhcMm41rgS3D9eMu4Drww3hJvF4vCreFO+CD8Fz8GJ8Ib4Kfxx/Ht+PH8a/J5AJWgRrgg8hliAkbCRUEBoI5wj9hBHCNFGBqE90IoYQecRcYimxjthBvEkcJk6TFEmGJBdSJCmZtIFUSWoiXSY9Jr0hk8k6ZEdyGFlAXk+uJJ8gXyUPkj9QlCgmFE9KHEVC2U45SrlAeUB5Q6VSDahu1FiqmLqdWk+9RH1KfS9HkzOX85fjya2Tq5FrleuXeyVPlNeXd5dfLp8nXyF/Sv6m/LgCUcFAwVOBo7BWoUbhtMI9hUlFmqKVYohimmKJYoPiNcVRJbySgZK3Ek+pQOmw0iWlIRpC06V50ri0TbQ62mXaMB1HN6T705PpxfQf6L30CWUlZVvlKOUc5Rrls8pSBsIwYPgzUhmljJOMu4yP8zTmuc/jz9s2r2le/7wplfkqbip8lSKVZpUBlY+qTFVv1RTVnaptqk/UMGomamFq2Wr71S6rjc+nz3eez51fNP/k/IfqsLqJerj6avXD6j3qkxqaGr4aGRpVGpc0xjUZmm6ayZrlmuc0x7RoWgu1BFrlWue1XjCVme7MVGYls4s5oa2u7act0T6k3as9rWOos1hno06zzhNdki5bN0G3XLdTd0JPSy9YL1+vUe+hPlGfrZ+kv0e/W3/KwNAg2mCLQZvBqKGKob9hnmGj4WMjqpGr0SqjWqM7xjhjtnGK8T7jWyawiZ1JkkmNyU1T2NTeVGC6z7TPDGvmaCY0qzW7x6Kw3FlZrEbWoDnDPMh8o3mb+SsLPYtYi50W3RZfLO0sUy3rLB9ZKVkFWG206rD6w9rEmmtdY33HhmrjY7POpt3mta2pLd92v+19O5pdsN0Wu067z/YO9iL7JvsxBz2HeIe9DvfYdHYou4R91RHr6OG4zvGM4wcneyex00mn351ZzinODc6jCwwX8BfULRhy0XHhuBxykS5kLoxfeHCh1FXbleNa6/rMTdeN53bEbcTd2D3Z/bj7Kw9LD5FHi8eUp5PnGs8LXoiXr1eRV6+3kvdi72rvpz46Pok+jT4Tvna+q30v+GH9Av12+t3z1/Dn+tf7TwQ4BKwJ6AqkBEYEVgc+CzIJEgV1BMPBAcG7gh8v0l8kXNQWAkL8Q3aFPAk1DF0V+nMYLiw0rCbsebhVeH54dwQtYkVEQ8S7SI/I0shHi40WSxZ3RslHxUXVR01Fe0WXRUuXWCxZs+RGjFqMIKY9Fh8bFXskdnKp99LdS4fj7OIK4+4uM1yWs+zacrXlqcvPrpBfwVlxKh4bHx3fEP+JE8Kp5Uyu9F+5d+UE15O7h/uS58Yr543xXfhl/JEEl4SyhNFEl8RdiWNJrkkVSeMCT0G14HWyX/KB5KmUkJSjKTOp0anNaYS0+LTTQiVhirArXTM9J70vwzSjMEO6ymnV7lUTokDRkUwoc1lmu5iO/kz1SIwkmyWDWQuzarLeZ0dln8pRzBHm9OSa5G7LHcnzyft+NWY1d3Vnvnb+hvzBNe5rDq2F1q5c27lOd13BuuH1vuuPbSBtSNnwy0bLjWUb326K3tRRoFGwvmBos+/mxkK5QlHhvS3OWw5sxWwVbO3dZrOtatuXIl7R9WLL4oriTyXckuvfWX1X+d3M9oTtvaX2pft34HYId9zd6brzWJliWV7Z0K7gXa3lzPKi8re7V+y+VmFbcWAPaY9kj7QyqLK9Sq9qR9Wn6qTqgRqPmua96nu37Z3ax9vXv99tf9MBjQPFBz4eFBy8f8j3UGutQW3FYdzhrMPP66Lqur9nf19/RO1I8ZHPR4VHpcfCj3XVO9TXN6g3lDbCjZLGseNxx2/94PVDexOr6VAzo7n4BDghOfHix/gf754MPNl5in2q6Sf9n/a20FqKWqHW3NaJtqQ2aXtMe9/pgNOdHc4dLT+b/3z0jPaZmrPKZ0vPkc4VnJs5n3d+8kLGhfGLiReHOld0Prq05NKdrrCu3suBl69e8blyqdu9+/xVl6tnrjldO32dfb3thv2N1h67npZf7H5p6bXvbb3pcLP9luOtjr4Ffef6Xfsv3va6feWO/50bA4sG+u4uvnv/Xtw96X3e/dEHqQ9eP8x6OP1o/WPs46InCk8qnqo/rf3V+Ndmqb307KDXYM+ziGePhrhDL/+V+a9PwwXPqc8rRrRG6ketR8+M+YzderH0xfDLjJfT44W/Kf6295XRq59+d/u9Z2LJxPBr0euZP0reqL45+tb2bedk6OTTd2nvpqeK3qu+P/aB/aH7Y/THkensT/hPlZ+NP3d8CfzyeCZtZubf94Tz+wplbmRzdHJlYW0KZW5kb2JqCjEwIDAgb2JqCjI2MTIKZW5kb2JqCjcgMCBvYmoKWyAvSUNDQmFzZWQgOSAwIFIgXQplbmRvYmoKMyAwIG9iago8PCAvVHlwZSAvUGFnZXMgL01lZGlhQm94IFswIDAgODU1LjE5NDYgMTI4LjI2MTNdIC9Db3VudCAxIC9LaWRzIFsgMiAwIFIgXQo+PgplbmRvYmoKMTEgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDMgMCBSID4+CmVuZG9iagoxMiAwIG9iagooTWFjIE9TIFggMTAuMTIuNiBRdWFydHogUERGQ29udGV4dCkKZW5kb2JqCjEzIDAgb2JqCihEOjIwMTcwOTE4MDkzMTQ3WjAwJzAwJykKZW5kb2JqCjEgMCBvYmoKPDwgL1Byb2R1Y2VyIDEyIDAgUiAvQ3JlYXRpb25EYXRlIDEzIDAgUiAvTW9kRGF0ZSAxMyAwIFIgPj4KZW5kb2JqCnhyZWYKMCAxNAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDYwMDIgMDAwMDAgbiAKMDAwMDAwMjczOSAwMDAwMCBuIAowMDAwMDA1NzY0IDAwMDAwIG4gCjAwMDAwMDAwMjIgMDAwMDAgbiAKMDAwMDAwMjcxOSAwMDAwMCBuIAowMDAwMDAyODUzIDAwMDAwIG4gCjAwMDAwMDU3MjkgMDAwMDAgbiAKMDAwMDAwMjk0OSAwMDAwMCBuIAowMDAwMDAyOTk0IDAwMDAwIG4gCjAwMDAwMDU3MDggMDAwMDAgbiAKMDAwMDAwNTg1NyAwMDAwMCBuIAowMDAwMDA1OTA3IDAwMDAwIG4gCjAwMDAwMDU5NjAgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSAxNCAvUm9vdCAxMSAwIFIgL0luZm8gMSAwIFIgL0lEIFsgPDQ3M2FhMjIzM2Q0ZDA2YmY0ZmM3Y2MyMWI0OWQ1ZDM5Pgo8NDczYWEyMjMzZDRkMDZiZjRmYzdjYzIxYjQ5ZDVkMzk+IF0gPj4Kc3RhcnR4cmVmCjYwNzcKJSVFT0YKAAARAAAADAAAAAgAAAAKAAAAEAAAAAAAAAAAAAAACQAAABAAAACBLAAArAYAAAwAAAAQAAAAAAAAAAAAAAALAAAAEAAAAKMEAACyAAAAFgAAAAwAAAAYAAAAEgAAAAwAAAABAAAAFQAAAAwAAAAEAAAADQAAABAAAAAAAAAAAAAAAEsAAAAQAAAAAAAAAAUAAAA7AAAACAAAABsAAAAQAAAAAAAAAAAAAABZAAAALAAAAAAAAAAAAAAA//////////8EAAAAAAAAAAAAtAaJLLQGiSwAADwAAAAIAAAAQwAAAAwAAAAFAAAAOwAAAAgAAAAbAAAAEAAAAAAAAAAAAAAAWQAAACwAAAAAAAAAAAAAAP//////////BAAAAAAAAAAAALIGiSyyBoksAAA8AAAACAAAAEMAAAAMAAAABQAAACcAAAAYAAAAAQAAAAAAAAAAAAAAAAAAACUAAAAMAAAAAQAAABMAAAAMAAAAAgAAADsAAAAIAAAAGwAAABAAAAApCQAAnAIAAFkAAABIAAAAAAAAAAAAAAD//////////wsAAAApCZwCKQkYA+oJGAPqCZIDKQmSAykJqQScCKkEnAggAvoJIAL6CZwCKQmcAj0AAAAIAAAAPAAAAAgAAAA+AAAAGAAAAOYAAAA5AAAACgEAAHwAAAAlAAAADAAAAAAAAIAlAAAADAAAAAEAAAATAAAADAAAAAIAAAA7AAAACAAAABsAAAAQAAAAogwAALEDAABZAAAAIAAAAAAAAAAAAAAA//////////8BAAAAogyxA1gAAAA0AAAAAAAAAAAAAAD//////////wYAAACiDHIEIwy2BJULtgQIC7YEiQpyBIkKsQNZAAAAKAAAAAAAAAAAAAAA//////////8DAAAAiQogAhYLIAIWC6YDWAAAADQAAAAAAAAAAAAAAP//////////BgAAABYLEwROCzkElQs5BN0LOQQVDBMEFQymA1kAAAAoAAAAAAAAAAAAAAD//////////wMAAAAVDCACogwgAqIMsQM9AAAACAAAADwAAAAIAAAAPgAAABgAAAAZAQAAOQAAAFEBAAB+AAAAJQAAAAwAAAAAAACAJQAAAAwAAAABAAAAEwAAAAwAAAACAAAAOwAAAAgAAAAbAAAAEAAAAEMOAACcAgAAWQAAAEAAAAAAAAAAAAAAAP//////////CQAAAEMOnAJDDqkEtg2pBLYNnAI3DZwCNw0gAsMOIALDDpwCQw6cAj0AAAAIAAAAPAAAAAgAAAA+AAAAGAAAAGABAAA5AAAAigEAAHwAAAAlAAAADAAAAAAAAIAlAAAADAAAAAEAAAATAAAADAAAAAIAAAA7AAAACAAAABsAAAAQAAAAcREAALEDAABZAAAAIAAAAAAAAAAAAAAA//////////8BAAAAcRGxA1gAAAA0AAAAAAAAAAAAAAD//////////wYAAABxEXIE8hC2BGQQtgTXD7YEWA9yBFgPsQNZAAAAKAAAAAAAAAAAAAAA//////////8DAAAAWA8gAuUPIALlD6YDWAAAADQAAAAAAAAAAAAAAP//////////BgAAAOUPEwQdEDkEZBA5BKwQOQTkEBME5BCmA1kAAAAoAAAAAAAAAAAAAAD//////////wMAAADkECACcREgAnERsQM9AAAACAAAADwAAAAIAAAAPgAAABgAAACZAQAAOQAAANEBAAB+AAAAJQAAAAwAAAAAAACAJQAAAAwAAAABAAAAEwAAAAwAAAACAAAAOwAAAAgAAAAbAAAAEAAAAAETAAA8AwAAWQAAACAAAAAAAAAAAAAAAP//////////AQAAAAETPANYAAAANAAAAAAAAAAAAAAA//////////8GAAAATRM8A2gTFQNoE+wCaBPCAk0TmwIBE5sCWQAAACgAAAAAAAAAAAAAAP//////////AwAAAMYSmwLGEjwDARM8Az0AAAAIAAAAGwAAABAAAADJEgAAuAMAAFkAAAA0AAAAAAAAAAAAAAD//////////wYAAADJErgDxhK4A8YSqQQ5EqkEORIgAg0TIAJYAAAANAAAAAAAAAAAAAAA//////////8GAAAAthMgAvcTiQL3E+wC9xM4A9ATiANxE6kDWQAAACgAAAAAAAAAAAAAAP//////////AwAAAE4UqQSTE6kEyRK4Az0AAAAIAAAAPAAAAAgAAAA+AAAAGAAAAOYBAAA5AAAAHgIAAHwAAAAlAAAADAAAAAAAAIAlAAAADAAAAAEAAAATAAAADAAAAAIAAAA7AAAACAAAABsAAAAQAAAAZxUAAJwCAABZAAAAUAAAAAAAAAAAAAAA//////////8NAAAAZxWcAmcVGQMoFhkDKBaTA2cVkwNnFSwEOBYsBDgWqQTZFKkE2RQgAjgWIAI4FpwCZxWcAj0AAAAIAAAAPAAAAAgAAAA+AAAAGAAAACwCAAA5AAAAUQIAAHwAAAAlAAAADAAAAAAAAIAlAAAADAAAAAEAAAATAAAADAAAAAIAAAA7AAAACAAAABsAAAAQAAAAkhgAAIQCAABZAAAAJAAAAAAAAAAAAAAA//////////8CAAAAkhiEAjkY2QJYAAAAQAAAAAAAAAAAAAAA//////////8JAAAAIBi+AvoXkAK1F5AChheQAm4XpgJuF8QCbhfjAokX8wKsFwYDWQAAACAAAAAAAAAAAAAAAP//////////AQAAABcYPQNYAAAAQAAAAAAAAAAAAAAA//////////8JAAAAYhhkA5QYpwOUGPcDlBheBEIYtgS5F7YEIRe2BM4WSAS+FicEWQAAACAAAAAAAAAAAAAAAP//////////AQAAABgX0ANYAAAAQAAAAAAAAAAAAAAA//////////8JAAAAKhfxA2kXOQS4FzkE7Bc5BAkYGwQJGPcDCRjRA+gXuAOrF5gDWQAAACAAAAAAAAAAAAAAAP//////////AQAAAGAXcQNYAAAAQAAAAAAAAAAAAAAA//////////8JAAAAERdHA+EWEwPhFscC4RZdAj8XEwK1FxMCIxgTAmQYUgKSGIQCPQAAAAgAAAA8AAAACAAAAD4AAAAYAAAAXwIAADcAAACQAgAAfgAAACUAAAAMAAAAAAAAgCUAAAAMAAAAAQAAABMAAAAMAAAAAgAAADsAAAAIAAAAGwAAABAAAADcGgAAPAMAAFkAAAAkAAAAAAAAAAAAAAD//////////wIAAADcGjwDFxs8A1gAAAA0AAAAAAAAAAAAAAD//////////wYAAABjGzwDfhsVA34b7AJ+G8ICYxubAhcbmwJZAAAAJAAAAAAAAAAAAAAA//////////8CAAAA3BqbAtwaPAM9AAAACAAAABsAAAAQAAAAIxsAACACAABZAAAAIAAAAAAAAAAAAAAA//////////8BAAAAIxsgAlgAAAA0AAAAAAAAAAAAAAD//////////wYAAADMGyACDRyJAg0c7AINHE4DzBu4AyMbuANZAAAAMAAAAAAAAAAAAAAA//////////8FAAAA3Bq4A9waqQRPGqkETxogAiMbIAI9AAAACAAAADwAAAAIAAAAPgAAABgAAAC+AgAAOQAAAOwCAAB8AAAAJQAAAAwAAAAAAACAJQAAAAwAAAABAAAAEwAAAAwAAAACAAAAOwAAAAgAAAAbAAAAEAAAALgdAAAsBAAAWQAAADgAAAAAAAAAAAAAAP//////////BwAAALgdLAS4HakEhRypBIUcIAITHSACEx0sBLgdLAQ9AAAACAAAADwAAAAIAAAAPgAAABgAAAD5AgAAOQAAABkDAAB8AAAAJQAAAAwAAAAAAACAJQAAAAwAAAABAAAAEwAAAAwAAAACAAAAOwAAAAgAAAAbAAAAEAAAAFsfAAAUAwAAWQAAACwAAAAAAAAAAAAAAP//////////BAAAAFsfFAMcH9sDmB/bA1sfFAM9AAAACAAAABsAAAAQAAAA+B4AAFAEAABZAAAAQAAAAAAAAAAAAAAA//////////8JAAAA+B5QBNweqQRSHqkEHh8gApYfIAJjIKkE2B+pBLwfUAT4HlAEPQAAAAgAAAA8AAAACAAAAD4AAAAYAAAAKQMAADkAAABgAwAAfAAAACUAAAAMAAAAAAAAgCUAAAAMAAAAAQAAABMAAAAMAAAAAgAAADsAAAAIAAAAGwAAABAAAACsIQAAnAIAAFkAAABAAAAAAAAAAAAAAAD//////////wkAAACsIZwCrCGpBB8hqQQfIZwCnyCcAp8gIAIrIiACKyKcAqwhnAI9AAAACAAAADwAAAAIAAAAPgAAABgAAABmAwAAOQAAAI8DAAB8AAAAJQAAAAwAAAAAAACAJQAAAAwAAAABAAAAEwAAAAwAAAACAAAAOwAAAAgAAAAbAAAAEAAAAFIjAACcAgAAWQAAAEgAAAAAAAAAAAAAAP//////////CwAAAFIjnAJSIxgDEyQYAxMkkgNSI5IDUiOpBMUiqQTFIiACIyQgAiMknAJSI5wCPQAAAAgAAAA8AAAACAAAAD4AAAAYAAAAnwMAADkAAADEAwAAfAAAACUAAAAMAAAAAAAAgCUAAAAMAAAAAQAAABMAAAAMAAAAAgAAADsAAAAIAAAAGwAAABAAAAAsJQAAZAMAAFkAAAAgAAAAAAAAAAAAAAD//////////wEAAAAsJWQDWAAAAEwAAAAAAAAAAAAAAP//////////DAAAACwl5ANqJTgE2CU4BEYmOASEJuQDhCZkA4Qm5AJGJpAC2CWQAmolkAIsJeQCLCVkAz0AAAAIAAAAGwAAABAAAAASJwAAZAMAAFkAAAAgAAAAAAAAAAAAAAD//////////wEAAAASJ2QDWAAAAEwAAAAAAAAAAAAAAP//////////DAAAABInKASLJrYE2CW2BCYltgSfJCgEnyRkA58koQImJRMC2CUTAosmEwISJ6ECEidkAz0AAAAIAAAAPAAAAAgAAAA+AAAAGAAAANEDAAA3AAAAEgQAAH4AAAAlAAAADAAAAAAAAIAlAAAADAAAAAEAAAATAAAADAAAAAIAAAA7AAAACAAAABsAAAAQAAAAVygAADwDAABZAAAAIAAAAAAAAAAAAAAA//////////8BAAAAVyg8A1gAAAA0AAAAAAAAAAAAAAD//////////wYAAACjKDwDvigVA74o7AK+KMICoyibAlcomwJZAAAAKAAAAAAAAAAAAAAA//////////8DAAAAHCibAhwoPANXKDwDPQAAAAgAAAAbAAAAEAAAAB8oAAC4AwAAWQAAADQAAAAAAAAAAAAAAP//////////BgAAAB8ouAMcKLgDHCipBI8nqQSPJyACYyggAlgAAAA0AAAAAAAAAAAAAAD//////////wYAAAAMKSACTSmJAk0p7AJNKTgDJimIA8coqQNZAAAAKAAAAAAAAAAAAAAA//////////8DAAAApCmpBOkoqQQfKLgDPQAAAAgAAAA8AAAACAAAAD4AAAAYAAAAHwQAADkAAABXBAAAfAAAACUAAAAMAAAAAAAAgCUAAAAMAAAAAQAAABMAAAAMAAAAAgAAADsAAAAIAAAAGwAAABAAAAACLAAAqQQAAFkAAABUAAAAAAAAAAAAAAD//////////w4AAAACLKkEAizfAoUr9wMUK/cDmCrfApgqqQQKKqkECiogAs4qIAJMK0ED1SsgAo8sIAKPLKkEAiypBD0AAAAIAAAAPAAAAAgAAAA+AAAAGAAAAGEEAAA5AAAAowQAAHwAAAAlAAAADAAAAAAAAIAoAAAADAAAAAEAAAAnAAAAGAAAAAEAAAAAAAAAAGmYAAAAAAAlAAAADAAAAAEAAAATAAAADAAAAAIAAAA7AAAACAAAABsAAAAQAAAAqgYAAFQDAABZAAAAIAAAAAAAAAAAAAAA//////////8BAAAAqgZUA1gAAABMAAAAAAAAAAAAAAD//////////wwAAACqBiwFKwWqBlIDqgZ5AaoG+/8sBfv/VAP7/30BeQEAAFIDAAArBQAAqgZ9AaoGVAM9AAAACAAAADwAAAAIAAAAPgAAABgAAAAAAAAAAAAAALIAAACyAAAAJQAAAAwAAAAAAACAKAAAAAwAAAABAAAAJwAAABgAAAABAAAAAAAAAP///wAAAAAAJQAAAAwAAAABAAAAEwAAAAwAAAACAAAAOwAAAAgAAAAbAAAAEAAAAKsEAAAkBAAAWQAAACAAAAAAAAAAAAAAAP//////////AQAAAKsEJARYAAAATAAAAAAAAAAAAAAA//////////8MAAAAuwQYBNQEJgTfBDcE6QRFBO4EYATWBHAExwR5BLMEeQSmBG4EjwRaBJgEMgSrBCQEPQAAAAgAAAA8AAAACAAAAD4AAAAYAAAAegAAAG0AAACEAAAAdwAAACUAAAAMAAAAAAAAgCUAAAAMAAAAAQAAABMAAAAMAAAAAgAAADsAAAAIAAAAGwAAABAAAADCAwAAgAQAAFkAAAAgAAAAAAAAAAAAAAD//////////wEAAADCA4AEWAAAAGQAAAAAAAAAAAAAAP//////////EgAAAHoDfgRtA8wDbgMmA28DdQKHAysCtgMRAtgD/gFLBAUCUQQGAu4EEAIrBXkCKwXbAisFnQO7BK0DWwTpAw4EGgQKBIAEwgOABD0AAAAIAAAAPAAAAAgAAAA+AAAAGAAAAFsAAAA1AAAAigAAAHgAAAAlAAAADAAAAAAAAIAlAAAADAAAAAEAAAATAAAADAAAAAIAAAA7AAAACAAAABsAAAAQAAAALQMAAEsCAABZAAAAIAAAAAAAAAAAAAAA//////////8BAAAALQNLAlgAAACgAAAAAAAAAAAAAAD//////////yEAAAAsAxUCBgMMAtoCCAKyAgQCOQICAgACCgKyARcCpwGbAqUBLAOiAc4DrwF8BPYBgAT2AYAE9wGABPcBgAQPAoEEIAJ2BC4CZgRDAk4EUQIrBGgCDgSSAtoDrwLNA9sCpwMfA20D/QImA/4C8AL/AsgCDAOuAhIDogIlA3sCLQNiAi0DSwI9AAAACAAAADwAAAAIAAAAPgAAABgAAAAsAAAANgAAAFUAAAB4AAAAJQAAAAwAAAAAAACAOwAAAAgAAAAbAAAAEAAAAAAAAAAAAAAAWQAAACwAAAAAAAAAAAAAAP//////////BAAAAAAAAAAAALQGiSy0BoksAAA8AAAACAAAAEMAAAAMAAAABQAAACgAAAAMAAAAAQAAAA4AAAAUAAAAAAAAABAAAAAUAAAA'
}