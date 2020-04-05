import React, { PureComponent } from 'react'
import { Modal } from '@sangre-fp/ui'
import PhenomenaSelector from '../containers/SandboxPhenomenaSelectorContainer'
import { requestTranslation } from '@sangre-fp/i18n'
import { ListBackground, ListContainer, modalStyles, ListClose, CloseIcon, ButtonsContainer } from '@sangre-fp/ui'
import { PhenomenonEditForm } from "@sangre-fp/content-editor"

export default class AddPhenomenaSandbox extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            createModalShown: false
        }
    }

    successfullyCreatedCallback = phenomenon => {
        const { changeAddPhenomenaVisibility, onPhenomenaDrag } = this.props

        changeAddPhenomenaVisibility()
        onPhenomenaDrag(false, phenomenon, true)
    }

    handlePhenomenaSelection = selectedPhenomena => this.setState({ selectedPhenomena })
    handleCreateNew = () => this.setState({ createModalShown: true })

    handleAdd = () => {
        const { addPublicPhenomenaToRadar } = this.props
        const { selectedPhenomena } = this.state

        addPublicPhenomenaToRadar(
            selectedPhenomena,
            this.successfullyCreatedCallback
        )
    }

    hideAddForm = () => this.setState({ createModalShown: false })

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
            addPhenomenaVisible
        } = this.props
        const { selectedPhenomena } = this.state

        if (!addPhenomenaVisible) {
            return null
        }

        return (
            <ListBackground>
                <ListContainer className={'add-phenomena-to-radar'} >
                    <h2>
                        {requestTranslation('sandboxTitle')}
                    </h2>
                    <ListClose onClick={changeAddPhenomenaVisibility}>
                        <CloseIcon className='material-icons'>close</CloseIcon>
                    </ListClose>
                    <div className={'phenomena-list-container'}>
                        <PhenomenaSelector
                            radarId={radarId}
                            language={language}
                            onSelect={this.handlePhenomenaSelection}
                            onCreate={this.handleCreateNew}
                            selectedPhenomena={selectedPhenomena}
                            onGroupChange={this.handleGroupChange}
                            filter
                            small
                        />
                    </div>
                    <ButtonsContainer>
                        <button className='btn btn-lg btn-plain-gray'
                                onClick={changeAddPhenomenaVisibility}>
                            {requestTranslation('cancel')}
                        </button>
                        <button className='btn btn-lg btn-primary'
                                disabled={!selectedPhenomena}
                                onClick={this.handleAdd}>
                            {requestTranslation('addToRadar')}
                        </button>
                    </ButtonsContainer>
                    {this.renderCreateModal()}
                </ListContainer>
            </ListBackground>
        )
    }
}
