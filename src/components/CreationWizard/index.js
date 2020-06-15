import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { isEqual, find, capitalize } from 'lodash-es'
import Select from 'react-select'
import { requestTranslation } from '@sangre-fp/i18n'
import { Search, Loading, Modal } from '@sangre-fp/ui'
import drupalApi from '@sangre-fp/connectors/drupal-api'
import { useEditableGroups } from '@sangre-fp/content-editor'
import { useDebounce } from 'use-debounce'
import { useTemplateSearch } from './hooks'
import { WizardStyles, previewModalStyles } from './styles'
import { radarLanguages } from '../../config'
import { startSession } from '../../session'
import { PUBLIC_URL } from '../../env'
import { loadingError } from '../../actions/network'
import { ErrorModal } from '../../containers'

/* eslint-disable */
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item)
}
/* eslint-enable */

const paramsString = document.location.search
const searchParams = new URLSearchParams(paramsString)
const gid = Number(searchParams.get('gid'))

const STEP_ZERO = 0
const STEP_ONE = 1
const STEP_TWO = 2
const STEP_THREE = 3
const STEP_FOUR = 4
const SEARCH_DEBOUNCE_MS = 300

const templateOptions = [
  {
    value: true,
    label: requestTranslation('prefilled')
  },
  {
    value: false,
    label: requestTranslation('empty')
  }
]

const CreationWizard = ({ dispatch }) => {
  const getNavigationSteps = () => {
    const navigationSteps = [
      {
        step: STEP_ZERO,
        label: requestTranslation('setup'),
        text: (completed = false) => completed || `1. ${requestTranslation('wizardSetupLabelText')}`
      },
      {
        step: useTemplate.value ? STEP_TWO : STEP_ONE,
        label: requestTranslation('concept'),
        text: (completed = false) => completed || `${!useTemplate.value ? '2.' : '3.'} ${requestTranslation('wizardConceptLabelText')}`
      },
      {
        step: useTemplate.value ? STEP_THREE : STEP_TWO,
        label: requestTranslation('title'),
        text: (completed = false) => completed || `${!useTemplate.value ? '3.' : '4.'} ${requestTranslation('wizardTitleLabelText')}`
      }
    ]

    if (useTemplate.value) {
      navigationSteps.insert(1, {
        step: STEP_ONE,
        label: requestTranslation('keywords'),
        text: (completed = false) => completed || `2. ${requestTranslation('wizardKeywordsLabelText')}`
      })
    }

    return navigationSteps
  }

  const getCompletedTextStep = stepToRender => {
    switch(stepToRender) {
      case STEP_ZERO:
        const groupLabel = selectedGroup && selectedGroup.label

        return language && selectedGroup && `${groupLabel} (${language})`
      case STEP_ONE:
        if (!useTemplate.value) {
          if (selectedTemplate && selectedTemplate.content.title) {
            return selectedTemplate.content.title
          }

          return requestTranslation('wizardConceptLabelText')
        }

        return templateList.length && searchValue
      case STEP_TWO:
        if (!useTemplate.value) {
          return requestTranslation('wizardTitleLabelText')
        }
        return selectedTemplate && selectedTemplate.content.title
      case STEP_THREE:
        return
        // return selectedTemplate && selectedTemplate.content.title
      default:
        return false
    }
  }

  const getEmptyTemplateCompletedCheckMark = stepToCheck => {
    switch(stepToCheck) {
      case STEP_ZERO:
        const groupLabel = selectedGroup && selectedGroup.label
        return language && selectedGroup && `${groupLabel} (${language})`

      case STEP_ONE:
        return selectedTemplate && selectedTemplate.content.title
      case STEP_TWO:
        return false
      default:
        return false
    }
  }

  const renderNavStep = ({step: navStep, label, text}, index) => {
    const activeOverride = !useTemplate.value && index === STEP_TWO && step === STEP_THREE

    return (
      <div key={navStep} className={`wizard__navigation__item ${(index === 0 || index <= step) && 'active'} ${step === STEP_ZERO && index !== 0 && 'hidden'}`}>
        <label className='wizard__navigation__item__label'>
          {label}
        </label>
        <div className='wizard__navigation__item__text'>
          {useTemplate.value ? !!getCompletedTextStep(index) : !!getEmptyTemplateCompletedCheckMark(index) && <i className='material-icons mr-1'>check_circle</i>}
          {text(getCompletedTextStep(index))}
        </div>
        <div className={`wizard__navigation__item__status ${(index === step || activeOverride) && 'active'}`} />
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
    const navigationSteps = getNavigationSteps()

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
        <footer className='wizard__footer container-fullwidth d-flex align-items-center justify-content-between'>
          <button
            className='btn btn-lg btn-outline-secondary wizard__footer__back'
            onClick={() => window.history.back()}
          >
            {requestTranslation('cancel')}
          </button>
          <div>
            <button
              className='btn btn-lg btn-outline-secondary mr-2 wizard__footer__back'
              onClick={handleBackClick}
            >
              <i className='material-icons wizard__footer__back__arrow'>chevron_left</i>
              {requestTranslation('back')}
            </button>
            <button
              disabled={(step === STEP_ZERO && (!language || groupId === null)) || (step > STEP_ZERO && !selectedTemplate) || (step === STEP_THREE && !titleValue)}
              className='btn btn-lg btn-primary wizard__footer__button'
              onClick={handleContinueClick}
            >
              {requestTranslation('continue')}
            </button>
          </div>
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
                  value={groupId}
                  onChange={({ value }) => setGroupId(value)}
                  options={groups.map(({ id, label }) => ({ value: id, label }))}
                  clearable={false}
                  placeholder={capitalize(requestTranslation('select')) + '...'}
                />
              </div>
              <div>
                <b className='wizard__select__label'>{requestTranslation('language')}</b>
                <Select
                  searchable={false}
                  name='language'
                  className='fp-radar-select wizard__select'
                  value={language}
                  onChange={({ value }) => setLanguage(value)}
                  options={radarLanguages()}
                  clearable={false}
                  placeholder={capitalize(requestTranslation('select')) + '...'}
                />
              </div>
              <div>
                <b className='wizard__select__label'>{requestTranslation('prefilledContent')}</b>
                <Select
                  searchable={false}
                  name='prefilled'
                  className='fp-radar-select wizard__select'
                  value={useTemplate}
                  onChange={value => setUseTemplate(value)}
                  options={templateOptions}
                  clearable={false}
                  placeholder={capitalize(requestTranslation('select')) + '...'}
                />
              </div>
            </div>
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
        const emptyTemplateClassName = `${!useTemplate.value ? 'wizard__content__naming-title' : ''}`

        return (
          <div className='d-flex flex-column align-items-center'>
            {useTemplate.value && (
              <Search
                className='wizard__content__search'
                placeholder={requestTranslation('creationWizardSearchPlaceholder')}
                searchIcon={false}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onClear={handleSearchClear}
              />
            )}
            {!!(templateList && templateList.length) && (
              <div className={emptyTemplateClassName}>
                {useTemplate.value && (
                  <h4 className={'text-center'}>{requestTranslation('wizardReccomendationsTitle')}</h4>
                )}
                <div className='wizard__content__list d-flex justify-content-center'>
                  {templateList.map(temp => renderTemplate(temp))}
                </div>
              </div>
            )}
            {error && <div>Error: {error.message}</div>}
            {!!(debouncedValue.length && !templateList.length && !loading) && (
              <div className={`w-100 text-center ${emptyTemplateClassName}`}>{requestTranslation('noResults')}</div>
            )}
          </div>
        )
    }
  }

  const handleContinueClick = async () => {
    switch (step) {
      case STEP_ZERO:
        if (!useTemplate.value) {
          setShowLoading(true)

          // perhaps do translation here ?
          setSearchValue('empty')

          setTimeout(() => {
            setShowLoading(false)
          }, SEARCH_DEBOUNCE_MS * 3)
        }

        return setStep(STEP_ONE)
      case STEP_ONE:
        return setStep(STEP_THREE)
      case STEP_TWO:
        return setStep(STEP_THREE)
      case STEP_THREE:
        setShowLoading(true)

        try {
          const data = await drupalApi.createRadar({
            group: groupId,
            radarName: titleValue,
            radarLanguage: language.value || language,
            phenomenaSet: selectedTemplate.id,
            radarTemplate: true
          })

          setShowLoading(false)
          setRadarId(data.id)

          return setStep(STEP_FOUR)
        } catch (err) {
          setShowLoading(false)
          dispatch(loadingError('CREATION_ERROR', new Error('Radar creation error'), requestTranslation('creatingRadarError')))
          return
        }
      case STEP_FOUR:
        return
      default:
        return
    }
  }

  const handleBackClick = () => {
    switch(step) {
      case STEP_ZERO:
        window.history.back()
        break
      case STEP_ONE:
        setStep(STEP_ZERO)
        handleSearchClear()
        break
      case STEP_TWO:
        setStep(STEP_ONE)
        if (useTemplate.value) {
          handleSearchClear()
        }
        setSelectedTemplate(null)
        setTitleValue('')
        break
      case STEP_THREE:
        if (useTemplate.value) {
          setStep(STEP_TWO)
        } else {
          setStep(STEP_ONE)
        }
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

  const [useTemplate, setUseTemplate] = useState(templateOptions[0])
  const [step, setStep] = useState(STEP_ZERO)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [titleValue, setTitleValue] = useState('')
  const [groupId, setGroupId] = useState(gid || null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [language, setLanguage] = useState(document.querySelector('html').getAttribute('lang') || 'en')
  const [previewModal, setPreviewModal] = useState(null)
  const [debouncedValue, clearTimeout] = useDebounce(searchValue, SEARCH_DEBOUNCE_MS)
  const [radarId, setRadarId] = useState(null)
  const { results: templateList, loading: templatesLoading, error } = useTemplateSearch(debouncedValue, language)
  const { groups, loading: loadingGroups } = useEditableGroups()
  const [showLoading, setShowLoading] = useState(false)
  const loading = templatesLoading || loadingGroups

  useEffect(() => {
   (async () => {
      await startSession()
    })()
  }, [])

  /* eslint-disable */
  useEffect(() => {
    setSelectedGroup(find(groups, ({ id }) => id === groupId) || null)
  }, [groupId, loadingGroups])

  useEffect(() => {
    if (templateList.length && step === STEP_ONE && useTemplate.value) {
      setStep(STEP_TWO)
    }
  }, [templateList])
  /* eslint-enable */
  return (
    <div className='wizard'>
      <WizardStyles />
      <div className={'wizard__main'}>
        {renderNav()}
        {renderStepNavigation()}
        {(loading || showLoading) && <Loading shown />}
        <div className={`wizard__content w-100 ${step === STEP_FOUR && 'wizard__content--large'}`}>
          {renderSteps()}
        </div>
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
      <ErrorModal />
    </div>
  )
}

export default connect(null, null)(CreationWizard)
