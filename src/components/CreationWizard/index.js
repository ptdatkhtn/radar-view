import React, { useState, useEffect } from 'react'
import { isEqual, find } from 'lodash-es'
import Select from 'react-select'
import { requestTranslation } from '@sangre-fp/i18n'
import { Search, Loading, Modal } from '@sangre-fp/ui'
import drupalApi from '@sangre-fp/connectors/drupal-api'
import { useEditableGroups } from '@sangre-fp/content-editor'
import { useDebounce } from 'use-debounce'
import { useTemplateSearch } from './hooks'
import { WizardStyles, previewModalStyles } from './styles'
import { radarLanguages } from '../../config'

const paramsString = document.location.search
const searchParams = new URLSearchParams(paramsString)
const gid = Number(searchParams.get('gid'))

const STEP_ZERO = 0
const STEP_ONE = 1
const STEP_TWO = 2
const STEP_THREE = 3
const STEP_FOUR = 4
const SEARCH_DEBOUNCE_MS = 300

const navigationSteps = [
  {
    step: STEP_ZERO,
    label: requestTranslation('group'),
    text: (completed = false) => completed || `1. ${requestTranslation('wizardGroupLabelText')}`
  },
  {
    step: STEP_ONE,
    label: requestTranslation('keywords'),
    text: (completed = false) => completed || `2. ${requestTranslation('wizardKeywordsLabelText')}`
  },
  {
    step: STEP_TWO,
    label: requestTranslation('concept'),
    text: (completed = false) => completed || `3. ${requestTranslation('wizardConceptLabelText')}`
  },
  {
    step: STEP_THREE,
    label: requestTranslation('title'),
    text: (completed = false) => completed || `4. ${requestTranslation('wizardTitleLabelText')}`
  }
]

const CreationWizard = ({ PUBLIC_URL }) => {
  const getCompletedTextStep = stepToRender => {
    switch(stepToRender) {
      case STEP_ZERO:
        const languageLabel = language.value || language
        const groupFind = find(groups, ({ value }) => value === group)
        const groupLabel = group.label || (groupFind && groupFind.label)

        return language && group && `${groupLabel} (${languageLabel})`
      case STEP_ONE:
        return templateList.length && searchValue
      case STEP_TWO:
        return selectedTemplate && selectedTemplate.title
      default:
        return false
    }
  }

  const renderNavStep = ({step: navStep, label, text}, index) => {
    return (
      <div key={navStep} className={`wizard__navigation__item ${(index === 0 || index <= step) && 'active'}`}>
        <label className='wizard__navigation__item__label'>
          {label}
        </label>
        <div className='wizard__navigation__item__text'>
          {!!getCompletedTextStep(index) && <i className='material-icons mr-1'>check_circle</i>}
          {text(getCompletedTextStep(index))}
        </div>
        <div className={`wizard__navigation__item__status ${index === step && 'active'}`} />
      </div>
    )
  }

  const renderTemplate = template => {
    const { id, content: { title, sectors = [] } } = template
    const selectedTemplateId = selectedTemplate && selectedTemplate.id
    const className = id === selectedTemplateId ? 'active' : ''

    return (
      <div className={`wizard__content__list__item d-flex flex-column align-items-center justify-content-between ${className}`} key={id}>
        <div className='text-center'>
          <h4 className='text-center'>{title}</h4>
          <b>{requestTranslation('sectors')}:</b>
          {sectors.map(({ title: sectorTitle, id: sectorId }) =>
            <label key={sectorId}>{sectorTitle}</label>
          )}
        </div>
        <div>
          <button
            className={`btn btn-outline-secondary wizard__content__list__item__button ${className}`}
            onClick={() => {
              if (isEqual(template, selectedTemplate)) {
                setSelectedTemplate(null)
              } else {
                setSelectedTemplate(template)
              }
            }}
          >
            {requestTranslation('select')}
          </button>
          <div
            className='d-flex align-items-center justify-content-center wizard__content__list__item__preview mt-3 hoverable'
            onClick={() => setPreviewModal(template)}
          >
            <i className="material-icons mr-2">visibility</i>
            {requestTranslation('previewButton')}
          </div>
        </div>
      </div>
    )
  }

  const renderStepNavigation = () => {
    if (step !== STEP_FOUR) {
      return (
        <div className='wizard__navigation container-fullwidth'>
          <div className='d-flex'>
            {navigationSteps.map((step, index) => renderNavStep(step, index))}
          </div>
        </div>
      )
    }

    return null
  }

  // add to UI package in cleanup
  const renderNav = () => (
    <nav className="navbar-dashboard">
      <div className='container-fullwidth'>
        <a className="navbar-brand" href={PUBLIC_URL}>
          <span className="sr-only">Futures Platform</span>
        </a>
      </div>
    </nav>
  )

  const renderFooter = () => {
    if (step !== STEP_FOUR) {
      return (
        <footer className='wizard__footer container-fullwidth d-flex align-items-center justify-content-end'>
          <button
            className='btn btn-lg btn-outline-secondary mr-2 wizard__footer__back'
            onClick={handleBackClick}
          >
            <i className='material-icons wizard__footer__back__arrow'>chevron_left</i>
            {requestTranslation('back')}
          </button>
          <button
            disabled={(step === STEP_ZERO && (!language || !group)) || (step > STEP_ZERO && !selectedTemplate) || (step === STEP_THREE && !titleValue)}
            className='btn btn-lg btn-primary wizard__footer__button'
            onClick={handleContinueClick}
          >
            {requestTranslation('continue')}
          </button>
        </footer>
      )
    }

    return null
  }

  const renderPreviewModal = () => {
    if (!previewModal) {
      return null
    }

    const { title } = previewModal

    return (
      <div className='d-flex wizard__preview'>
        <div className='wizard__preview__left'>
          <label className='mb-0'>{requestTranslation('templatePreview')}</label>
          <h2>{title}</h2>
          <div className='mb-2' dangerouslySetInnerHTML={{ __html: requestTranslation('previewInHub') }} />
          <button
            className='btn btn-primary mt-4'
            onClick={() => setPreviewModal(null)}
          >
            {requestTranslation('close')}
          </button>
        </div>
        <div className='wizard__preview__right' />
      </div>
    )
  }

  const renderSteps = () => {
    switch(step) {
      case STEP_ZERO:
        return (
          <div className='d-flex flex-column align-items-center'>
            <h4 className='mb-3 wizard__content__naming-title'>{requestTranslation('groupAndLanguageSelectionTitle')}</h4>
            <div className='d-flex align-items-center mt-1'>
              <div>
                <b className='wizard__select__label'>{requestTranslation('group')}</b>
                <Select
                  searchable={false}
                  name='group'
                  className='fp-radar-select wizard__select'
                  value={group}
                  onChange={value => setGroup(value)}
                  options={groups}
                  clearable={false}
                />
              </div>
              <div>
                <b className='wizard__select__label'>{requestTranslation('language')}</b>
                <Select
                  searchable={false}
                  name='language'
                  className='fp-radar-select wizard__select'
                  value={language}
                  onChange={value => setLanguage(value)}
                  options={radarLanguages()}
                  clearable={false}
                  placeholder={requestTranslation('select').toLowerCase() + '...'}
                />
              </div>
            </div>
          </div>
        )
      case STEP_ONE:
        return (
          <div className='d-flex flex-column align-items-center'>
            <Search
              className='wizard__content__search'
              placeholder={requestTranslation('creationWizardSearchPlaceholder')}
              searchIcon={false}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onClear={handleSearchClear}
            />
            {loading && <Loading shown />}
            {error && <div>Error: {error.message}</div>}
            {!!(templateList && templateList.length) && (
              <>
                <h4>{requestTranslation('wizardReccomendationsTitle')}</h4>
                <div className='wizard__content__list d-flex justify-content-center'>
                  {templateList.map(temp => renderTemplate(temp))}
                </div>
              </>
            )}
          </div>
        )
      case STEP_THREE:
        return (
          <div className='d-flex flex-column align-items-center'>
            <h4 className='mb-3 wizard__content__naming-title'>{requestTranslation('nameYourRadar')}</h4>
            <Search
              className='wizard__content__search-title'
              placeholder={requestTranslation('creationWizardTitlePlaceholder')}
              searchIcon={false}
              value={titleValue}
              onChange={e => setTitleValue(e.target.value)}
              onClear={() => setTitleValue('')}
              maxLength={50}
            />
          </div>
        )
      case STEP_FOUR:
        return (
          <div className='d-flex w-100 justify-content-center'>
            <div className='wizard__content__completion d-flex flex-column align-items-center text-center'>
              <h4>{requestTranslation('congrats')}</h4>
              <h2>{requestTranslation('createdRadarTitle')}</h2>
              <p dangerouslySetInnerHTML={{ __html: requestTranslation('createdRadarLabelOne') }} />
              <p className='mb-0' dangerouslySetInnerHTML={{ __html: requestTranslation('createdRadarLabelTwo') }} />
              <div className='d-flex align-items-center justify-content-between w-100 mt-5'>
                <button
                  className='btn btn-lg btn-outline-secondary wizard__footer__back pl-0'
                  onClick={handleResetSteps}
                >
                  {requestTranslation('createAnother')}
                </button>
                <button
                  className='btn btn-lg btn-primary'
                  onClick={() => {
                    const { origin, pathname } = window.location
                    window.location.href = origin + pathname + `?node=${radarId}`
                  }}
                >
                  {requestTranslation('openTheRadar')}
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const handleContinueClick = async () => {
    switch (step) {
      case STEP_ZERO:
        return setStep(STEP_ONE)
      case STEP_TWO:
        return setStep(STEP_THREE)
      case STEP_THREE:
        return setStep(STEP_FOUR)
      case STEP_FOUR:
        loading = true

        const data = await drupalApi.createRadar({
          group: group.value ? group : find(groups, ({ value }) => value === gid),
          radarName: titleValue,
          radarLanguage: language.value || language,
          phenomenaSet: selectedTemplate.id,
        })

        loading = templatesLoading || loadingGroups

        console.log(data, 'created radar succ')

        return
      default:
        return
    }
  }

  const handleBackClick = () => {
    switch(step) {
      case STEP_ZERO:
        window.location.href = PUBLIC_URL
        break
      case STEP_ONE:
        setStep(STEP_ZERO)
        handleSearchClear()
        setTitleValue('')
        break
      case STEP_TWO:
        setStep(STEP_ONE)
        handleSearchClear()
        setTitleValue('')
        break
      case STEP_THREE:
        setStep(STEP_TWO)
        setTitleValue('')
        break
      default:
        return
    }
  }

  const handleSearchClear = () => {
    setSearchValue('')
    setSelectedTemplate(null)
    clearTimeout()
  }

  const handleResetSteps = () => {
    setStep(STEP_ZERO)
    setSelectedTemplate(null)
    setSearchValue('')
    setTitleValue('')
    setRadarId(null)
  }

  const [step, setStep] = useState(STEP_ZERO)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [titleValue, setTitleValue] = useState('')
  const [group, setGroup] = useState(gid)
  const [language, setLanguage] = useState(document.querySelector('html').getAttribute('lang') || 'en')
  const [previewModal, setPreviewModal] = useState(null)
  const [debouncedValue, clearTimeout] = useDebounce(searchValue, SEARCH_DEBOUNCE_MS)
  const [radarId, setRadarId] = useState(null)
  const { results: templateList, loading: templatesLoading, error } = useTemplateSearch(debouncedValue, [])
  const { groups, loading: loadingGroups } = useEditableGroups()
  let loading = templatesLoading || loadingGroups

  useEffect(() => {
    if (templateList.length && step === STEP_ONE) {
      setStep(STEP_TWO)
    }
  }, [templateList, step])

  return (
    <div className='wizard'>
      <WizardStyles />
      {renderNav()}
      {renderStepNavigation()}
      <div className={`wizard__content w-100 ${step === STEP_FOUR && 'wizard__content--large'}`}>
        {renderSteps()}
      </div>
      {renderFooter()}
      <Modal
        isOpen={!!previewModal}
        contentLabel={'Preview modal'}
        onRequestClose={() => setPreviewModal(null)}
        ariaHideApp={false}
        style={previewModalStyles}
      >
        {renderPreviewModal()}
      </Modal>
    </div>
  )
}

export default CreationWizard
