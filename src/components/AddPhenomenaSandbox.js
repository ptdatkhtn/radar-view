import React, { PureComponent } from 'react'
import * as d3 from 'd3'
import Draggable from 'react-draggable'
import PhenomenaSelector from '../containers/SandboxPhenomenaSelectorContainer'
import { requestTranslation } from '@sangre-fp/i18n'
import { ListContainer, modalStyles, ListClose, CloseIcon, BorderTitleContainer as Container, Modal } from '@sangre-fp/ui'
import { PhenomenonEditForm } from "@sangre-fp/content-editor"

export default class AddPhenomenaSandbox extends PureComponent {
    state = {
        createModalShown: false,
        filtersShown: false,
        resetFilters: 0
    }

    componentDidMount() {
        const { updateMouseCoords } = this.props
        const sandbox = d3.select('.add-phenomena-to-radar')

        sandbox
            .on('mousemove', updateMouseCoords)
            .on('touchstart', updateMouseCoords)
            .on('touchmove', updateMouseCoords)
    }

    successfullyCreatedCallback = phenomenon => {
        const { onPhenomenaDrag } = this.props

        onPhenomenaDrag(false, phenomenon, true)
    }

    handlePhenomenaSelection = selectedPhenomena => this.setState({ selectedPhenomena })
    handleCreateNew = () => this.setState({ createModalShown: true })

    handleAdd = phenomenon => {
        const { addPublicPhenomenaToRadar } = this.props

        addPublicPhenomenaToRadar(phenomenon, this.successfullyCreatedCallback)
    }

    hideAddForm = () => this.setState({ createModalShown: false })
    bumpResetFilters = () => this.setState({ resetFilters: this.state.resetFilters + 1 })

    renderCreateModal() {
        const {
            changeAddPhenomenaVisibility,
            storePhenomenon,
            onPhenomenaDrag,
            radar
        } = this.props

        const { createModalShown } = this.state

        return (
            <Modal isOpen={createModalShown}
                   contentLabel={'Create phenomena'}
                   style={modalStyles}
                   ariaHideApp={false}
                   onRequestClose={this.hideAddForm}
            >
                <PhenomenonEditForm
                    onSubmit={(values, newsFeedChanges) => {
                        storePhenomenon(values, newsFeedChanges, phenomenon => {
                            this.hideAddForm()
                            changeAddPhenomenaVisibility()
                            onPhenomenaDrag(false, phenomenon, true)
                        })
                    }}
                    onCancel={this.hideAddForm}
                    onDelete={() => {}}
                    radar={radar}
                />
            </Modal>
        )
    }

    render() {
        const {
            changeAddPhenomenaVisibility,
            radarId,
            language,
            placing
        } = this.props
        const {
            selectedPhenomena,
            filtersShown,
            resetFilters
        } = this.state

        return (
            <Draggable handle=".handle">
                <ListContainer
                    className={'add-phenomena-to-radar'}
                    style={{
                        zIndex: placing ? 0 : 1,
                        opacity: placing ? 0.8 : 1
                    }}
                >
                    <Container className='flex-shrink-0 handle' style={{ cursor: 'move' }}>
                        <h3 className='radar-widget-title mb-0'>
                            {requestTranslation('sandboxTitle')}
                        </h3>
                    </Container>
                    <ListClose onClick={changeAddPhenomenaVisibility}>
                        <CloseIcon className='material-icons'>close</CloseIcon>
                    </ListClose>
                    <Container className={'phenomena-list-container'} filtersShown={filtersShown}>
                        <PhenomenaSelector
                            radarId={radarId}
                            language={language}
                            onSelect={this.handlePhenomenaSelection}
                            onCreate={this.handleCreateNew}
                            selectedPhenomena={selectedPhenomena}
                            onAddToRadarClick={this.handleAdd}
                            sandbox
                            filter
                            filtersShown={filtersShown}
                            handleFilterChange={() => this.setState({ filtersShown: !filtersShown })}
                            resetFilters={resetFilters}
                            bumpResetFilters={this.bumpResetFilters}
                        />
                    </Container>
                    {filtersShown ? (
                        <Container filtersShown={filtersShown}>
                            <button className='btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center' onClick={this.bumpResetFilters}>
                                <i className='material-icons mr-1' style={{ fontSize: '16px' }}>replay</i>
                                {requestTranslation('resetFilters')}
                            </button>
                        </Container>
                    ) : (
                        <Container className='d-flex flex-shrink-0'>
                            <button
                              onClick={this.handleCreateNew}
                              className='btn btn-outline-secondary'
                            >
                              {requestTranslation("addNewPhenomena")}
                            </button>
                            <button className='btn btn-primary ml-auto'
                                    onClick={changeAddPhenomenaVisibility}>
                                {requestTranslation('done')}
                            </button>
                        </Container>
                    )}
                    {this.renderCreateModal()}
                </ListContainer>
            </Draggable>
        )
    }
}
