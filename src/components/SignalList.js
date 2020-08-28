import React, { PureComponent } from 'react'
import {
    ListBackground,
    ListContainer,
    ListClose,
    CloseIcon,
    ButtonsContainer,
    modalStyles,
    SidePadding,
    SearchInput
} from '@sangre-fp/ui'
import _ from 'lodash'
import AddSignalForm from '../containers/AddSignalFormContainer'
import { requestTranslation } from '@sangre-fp/i18n'
import { Modal } from '@sangre-fp/ui'
import styled from 'styled-components'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_TIME = 250

class SignalList extends PureComponent {
    state = {
        page: 1,
        searchInput: ''
    }

    debounceTimeout = false

    componentWillUpdate(nextProps, nextState) {
        const { fetchRadarSignals, signalData: { totalRadarSignals, signalListVisible }, loading } = this.props
        const { page, searchInput } = this.state
        const nextPage = nextState.page
        const totalPages = totalRadarSignals / PAGE_SIZE
        const willBeVisible = nextProps.signalData.signalListVisible

        if (signalListVisible !== willBeVisible) {
            this.setState({ page: 1, searchInput: '' }, () => {
                if (willBeVisible) {
                    fetchRadarSignals()
                }
            })
        }

        if (!loading.length && nextPage !== page && nextPage > page && nextPage <= totalPages + 1) {
            fetchRadarSignals(searchInput, nextPage - 1, PAGE_SIZE)
        }
    }

    handleArchiveSignal = signalId => {
        const { groupId, archiveSignal, fetchRadarSignals } = this.props
        archiveSignal(groupId, signalId, () => {
            fetchRadarSignals()
        })
    }

    handleScroll = e => {
        const { loading, signalData: { totalRadarSignals } } = this.props
        const { page } = this.state
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
        const totalPages = totalRadarSignals / PAGE_SIZE

        if (bottom && !loading.length && page < totalPages + 1) {
            this.setState({ page: page + 1 })
        }
    }

    handleSearchChange = ({ target }) => {
        const { fetchRadarSignals } = this.props
        this.setState({ searchInput: target.value, page: 1 })

        clearTimeout(this.debounceTimeout)
        this.debounceTimeout = setTimeout(() => fetchRadarSignals(target.value, 0, PAGE_SIZE), SEARCH_DEBOUNCE_TIME)
    }

    renderSignal(signal, index) {
        const { canArchiveSignals } = this.props
        const { id, content: { title, body, media: { image: image_url } = {} } = {}, created_at: created, created_by_name: username } = signal
        const date = created ? created.slice(0, 10) : new Date().toJSON().slice(0, 10)

        return (
            <SignalItem
                key={index}
                className='d-flex flex-column pt-4 pb-4 justify-content-center'
                style={{ backgroundColor: index % 2 === 0 ? 'white' : '#E7E7E8' }}
            >
                <h3>{title}</h3>
                <div className='d-flex mb-2'>
                    {(image_url && image_url.length) ?
                        (<img
                            alt=''
                            src={image_url}
                            className='mr-4 mt-2 mb-3'
                            style={{ objectFit: 'contain', height: '105px' }}
                        />)
                        : null
                    }
                    <div dangerouslySetInnerHTML={{ __html: body }} />
                </div>
                {date.replace(/-/g, '.').split('.').reverse().join('.')}
                {username ? (
                    <div>
                        {requestTranslation('createdBy')}:
                        &nbsp;
                        {username}
                    </div>)
                : ''}
                {canArchiveSignals && (
                  <ButtonsContainer style={{ justifyContent: 'flex-start' }}>
                      <button
                        className="btn btn-md btn-plain-gray pl-0"
                        onClick={() => window.confirm(requestTranslation('deleteSignalConfirmation')) && this.handleArchiveSignal(id)}
                      >
                          {requestTranslation('delete')}
                      </button>
                  </ButtonsContainer>
                )}
            </SignalItem>
        )
    }

    renderSignals() {
        const { signalData: { signals } } = this.props

        if (signals.length) {
            return (
                <SearchResultsList small className='d-flex h-100 flex-column mt-5'>
                    {_.map(signals, this.renderSignal.bind(this))}
                </SearchResultsList>
            )
        }

        return (
            <SidePadding><b>{requestTranslation('noSignalsCreated')}</b></SidePadding>
        )
    }

    renderCreateModal() {
        const { signalData: { signalCreateVisibility } } = this.props

        return (
            <Modal
                isOpen={signalCreateVisibility}
                contentLabel={'Create Signal'}
                style={modalStyles}
                ariaHideApp={false}
            >
                <AddSignalForm />
            </Modal>
        )
    }

    render() {
        const {
            changeSignalListVisibility,
            changeSignalCreateVisibility,
            signalData: {
                signalListVisible
            }
        } = this.props
        const { searchInput } = this.state

        if (!signalListVisible) {
            return null
        }

        return (
            <ListBackground onScroll={this.handleScroll}>
                <ListContainer className='justify-content-between' style={{ padding: '30px 0', height: 'auto' }}>
                    <ListClose onClick={changeSignalListVisibility}>
                        <CloseIcon className='material-icons'>close</CloseIcon>
                    </ListClose>
                    <SidePadding className='d-flex justify-content-between algin-items-center'>
                        <h2 className='m-0'>{requestTranslation('listOfSignals')}</h2>
                        <div className='d-flex'>
                            <SearchInput
                                type={'search'}
                                small={true}
                                className='mr-4'
                                placeholder={requestTranslation('searchByKeywords')}
                                value={searchInput}
                                onChange={this.handleSearchChange}
                            />
                            <button className='btn btn-outline-secondary flex-shrink-0'
                                onClick={changeSignalCreateVisibility}
                            >
                                {requestTranslation('createNew')}
                            </button>
                        </div>
                    </SidePadding>
                    {this.renderSignals()}
                    <SidePadding>
                        <ButtonsContainer>
                            <button className='btn btn-primary' onClick={changeSignalListVisibility}>
                                {requestTranslation('close')}
                            </button>
                        </ButtonsContainer>
                    </SidePadding>
                </ListContainer>
                {this.renderCreateModal()}
            </ListBackground>
        )
    }
}

export default SignalList

const SearchResultsList = styled.div`
    flex: 1;
    width: 91%;
    min-height: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.10);
    margin: 0 auto;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
    overflow-y: auto;
    overflow-x: hidden;
`

const SignalItem = styled.div`
    border-bottom: 1px solid #d5dbdf;
    padding: 0 25px;
`
