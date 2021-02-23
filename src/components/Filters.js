import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { requestTranslation } from '@sangre-fp/i18n'
import { Checkbox, PhenomenonType, Tag } from '@sangre-fp/ui'
import { useTags } from '@sangre-fp/hooks'

export const Filters = props => {
    const renderPhenomenaType = phenomenaType => {
        const {groupType, id, alias, title, style} = phenomenaType
        const {activeFilter, setActiveFilter} = props

        return (
            <StateContainer key={id}>
                <PhenomenaState>
                    <PhenomenonType type={alias} size={15} fill = {style ? style.color : null} />
                </PhenomenaState>
                <Checkbox
                    label={groupType ? title : requestTranslation(alias)}
                    value={id}
                    checked={_.find(activeFilter, filter => filter.id === id)}
                    onChange={() => setActiveFilter(phenomenaType)}
                    className='phenomena-checkbox'
                />
            </StateContainer>
        )
    }

    const renderTags = tags => {
        const {language, activeTagFilter, setActiveTagFilter} = props

        return (
            <div>
                {!!(_.isArray(tags) && tags.length) && (
                    <div>
                        <div className='d-flex flex-row flex-wrap'>
                            {tags.map((tag, index) => {
                                return (
                                    <OptionsListItem key={index} style={{padding: '0 5px'}}>
                                        <Tag
                                            label={tag.label[language] || tag.label}
                                            active={_.find(activeTagFilter, filter => filter === tag.uri)}
                                            onClick={() => setActiveTagFilter(tag.uri)}
                                        />
                                    </OptionsListItem>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const renderLoading = () => <div>{requestTranslation('loading')}</div>

    const {
        filtersVisible,
        phenomenaTypes,
        toggleFilter,
        resetFilters,
        activeFilter,
        activeTagFilter,
        group,
        hideInfoButton = false
    } = props

    const {tags} = useTags(group && group.id)
    let [fpTags, groupTags] = tags
    const activeFilters = [...activeFilter, ...activeTagFilter].length

    return (
        <div style={{ zIndex: 2 }}>
            {!hideInfoButton && <div className='radar-nav' id='radar-nav-bottomleft' style={{zIndex: 1}}>
                    <HubLink className='btn-round btn-lg d-flex align-items-center justify-content-center' target='_blank'
                             rel='noopener noreferrer' href={requestTranslation('infoUrl')}>
                        <span className='af-custom-info'/>
                        <span className='sr-only'>Info</span>
                    </HubLink>
                </div> }
            <FiltersButton
              className={`btn-round btn-lg d-flex align-items-center justify-content-center ${activeFilters ? '' : 'inactive'}`}
              onClick={toggleFilter}
            >
                <i className='material-icons' style={{transform: 'rotate(-90deg)', fontWeight: 'bold'}}>tune</i>
                {!!activeFilters && (
                  <ActiveFiltersIndicator
                      className='d-flex justify-content-center align-items-center'>{activeFilters}</ActiveFiltersIndicator>
                )}
            </FiltersButton>
            {filtersVisible && (
                <LegendContainer className='pb-4'>
                    <button className={'btn-close-modal'} onClick={toggleFilter}>
                        <i className='material-icons'>close</i>
                    </button>
                    <Container>
                        <h3 className='radar-widget-title mb-0'>{requestTranslation('filterPhenomena')}</h3>
                    </Container>
                    <Container style={{padding: '15px 10px'}}>
                        <h5 className='mb-2 mt-1 ml-2'>{requestTranslation('filterByTag')}</h5>
                        {renderTags([...groupTags, ...fpTags])}
                    </Container>
                    <Container>
                        <h5 className='mb-3 mt-1'>{requestTranslation('filterByType')}</h5>
                        {phenomenaTypes && phenomenaTypes.length ? _.map(phenomenaTypes, renderPhenomenaType) : renderLoading}
                    </Container>
                    <Container style={{borderBottom: 'none'}}>
                        <button className='btn btn-outline-secondary w-100' onClick={resetFilters}>
                            {requestTranslation('resetFilters')}
                        </button>
                    </Container>
                </LegendContainer>
            )}
        </div>
    )
}

const OptionsListItem = styled.div`
    padding: 0 12px;
    display: flex;
    align-items: center;
    margin-top: 8px;
`

const LegendContainer = styled.div`
  width: 270px;
  position: absolute;
  background-color: #F2F4F4;
  left: 37px;
  bottom: 85px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`

const FiltersButton = styled.button`
  position: absolute;
  bottom: 65px;
  left: 15px;
  /*background-color: rgb(242,244,244) !important;*/

  &.inactive {
    background-color: transparent !important;
    border: 2px solid white;

    i {
      color: white;
    }
  }
`

const Container = styled.div`
  padding: 15px 17px;
  border-bottom: 1px solid #e9e9ea;
  max-height: 260px;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 8px;
    margin-right: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(194, 208, 215);
    border-radius: 20px;
  }

  ::-webkit-scrollbar-track {
    background: white;
    border-radius: 20px;
  }
`

const StateContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  min-height: 25px;
  align-items: center;
  position: relative;
`

const PhenomenaState = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  position: absolute;
  z-index: 10;
  left: 27px;
`

const HubLink = styled.a`
  background-color: transparent;
  border: 2px solid white;
  &:hover {
    background-color: transparent;
  }
`

const ActiveFiltersIndicator = styled.div`
  width: 13px;
  height: 13px;
  background-color: white;
  font-size: 9px;
  position: absolute;
  color: black;
  top: 0px;
  left: 0px;
  border-radius: 50%;
`
