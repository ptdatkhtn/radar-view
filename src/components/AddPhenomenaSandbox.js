import React, { PureComponent } from 'react'
import * as d3 from 'd3'
import Draggable from 'react-draggable'
import PhenomenaSelector from '../containers/SandboxPhenomenaSelectorContainer'
import { requestTranslation } from '@sangre-fp/i18n'
import { ListContainer, modalStyles, ListClose, CloseIcon, BorderTitleContainer as Container, Modal } from '@sangre-fp/ui'
import { PhenomenonEditForm } from "../components/PhenomenonEditForm/PhenomenonEditForm"
import PhenomenaTagSelector from '../containers/PhenomenaTagSelector';
import { truncate } from 'lodash'

export default class AddPhenomenaSandbox extends PureComponent {
    state = {
        createModalShown: false,
        filtersShown: false,
        resetFilters: 0,
        isOpenSelectorModal: true
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
    handleCreateNew = () => this.setState({ createModalShown: true,
        editModal: {
            type: 'CREATE',
            uuid: null,
            group: null
        },
    })

    handleAdd = phenomenon => {
        const { addPublicPhenomenaToRadar } = this.props

        addPublicPhenomenaToRadar(phenomenon, this.successfullyCreatedCallback)
    }

    hideAddForm = () => {
        this.setState({ 
            createModalShown: false, 
            editModal: null
         }, () => {
            this.props.updateStoredPhenonSelector(null)
            this.props.setPhenomenonToTag(false)
        }) 
        
    }
    bumpResetFilters = () => this.setState({ resetFilters: this.state.resetFilters + 1 })

    handleOpenTagSelectorModal = (isOpenModal) => {
        this.setState({
            isOpenSelectorModal: isOpenModal
        })
    }

    renderCreateModal() {
        const {
            changeAddPhenomenaVisibility,
            storePhenomenon,
            onPhenomenaDrag,
            radar,
            updateStoredPhenonSelector,
            storedPhenomenon,
            storedPhenSelector,
            setPhenomenonToTag,
            phenomenaListData,
            radarSettings
        } = this.props

        const { createModalShown } = this.state

        console.log('check open tag selector ...', this.state.editModal, this.state.isOpenSelectorModal,
        !!this.state.isOpenSelectorModal && !!this.state.editModal && this.state.editModal.type === 'EDIT'
        )
        return (
            <Modal isOpen={createModalShown}
                   contentLabel={'Create phenomena'}
                   style={modalStyles}
                   ariaHideApp={false}
                   onRequestClose={this.hideAddForm}
            >
                <>
                     {
                                    !!this.state.isOpenSelectorModal && !!this.state.editModal && this.state.editModal.type === 'EDIT' && <PhenomenaTagSelector
                                                        group={radar?.groupId || storedPhenSelector?.groups[0] || 0}
                                                        language={radar?.language || storedPhenSelector?.language || 'en'}
                                                        isInEditMode={!!this.state.editModal}
                                                        editModal={this.state.editModal}
                                                        isCreateNewContentCard1={true}
                                                        isCreateNewContentCard={true}

                                                    />
                                  }
                    </>

                <PhenomenonEditForm
                    {...this.props}
                    isCreateNewContentCard={true}
                    handleOpenTagSelectorModal={this.handleOpenTagSelectorModal}
                    editModal={this.state.editModal}
                    storedPhenSelector={this.props.storedPhenSelector}
                    setPhenomenonToTag={this.props.setPhenomenonToTag}
                    createOrEditMode={true}
                    onSubmit={(values, newsFeedChanges) => {
                        if (this.state.editModal.type === 'CREATE') {
                            storePhenomenon(values, newsFeedChanges, phenomenon => {
                                this.setState({
                                    editModal: {
                                        type: 'EDIT',
                                        uuid: null,
                                        group: null
                                    },
                                    // indexForTagging: indexForTagging
                                })
                                console.log('valuesvalues', values, phenomenon)
                                // this.hideAddForm()
                                // updateStoredPhenonSelector({...phenomenon})
                                // changeAddPhenomenaVisibility()
                                // onPhenomenaDrag(false, phenomenon, true)
                            })
                        } else {
                            console.log('after...', storedPhenSelector, values)
                            values['id'] = storedPhenSelector?.id
                            storePhenomenon(values, newsFeedChanges, phenomenon => {
                                this.setState({
                                    editModal: null,
                                    // indexForTagging: indexForTagging
                                })
                                console.log('valuesvalues', values, phenomenon, storedPhenSelector)
                                this.hideAddForm()
                                setPhenomenonToTag(false)
                                // updateStoredPhenonSelector({...phenomenon})
                                changeAddPhenomenaVisibility()
                                onPhenomenaDrag(false, phenomenon, true)
                            })
                        }
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
            radarLanguage,
            placing
        } = this.props
        const {
            selectedPhenomena,
            filtersShown,
            resetFilters
        } = this.state
        const { phenomena } = this.props;   
        console.log('propsss', phenomena)

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
                            radarLanguage={radarLanguage}
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


// const AddPhenomenaSandbox = ({
//     updateMouseCoords,
//     onPhenomenaDrag,
//     addPublicPhenomenaToRadar,
//     changeAddPhenomenaVisibility,
//     radarId,
//     language,
//     radarLanguage,
//     placing,
//     storePhenomenon,
//     radar
// }) => {
//     const [createModalShown, setcreateModalShown] = useState(false)
//     const [filtersShown, setfiltersShown] = useState(false)
//     const [resetFilters, setresetFilters] = useState(0)
//     const [selectedPhenomena, setselectedPhenomena] = useState(null)

//     useEffect(() => {
//         const sandbox = d3.select('.add-phenomena-to-radar')

//         sandbox
//             .on('mousemove', updateMouseCoords)
//             .on('touchstart', updateMouseCoords)
//             .on('touchmove', updateMouseCoords)
//     }, [])

//     console.log('111111', storePhenomenon)
//     const successfullyCreatedCallback = phenomenon => {
//         onPhenomenaDrag(false, phenomenon, true)
//     }

//     const handlePhenomenaSelection = selectedPhenomena => setselectedPhenomena(selectedPhenomena)
//     const handleCreateNew = () => setcreateModalShown(createModalShown)

//     const handleAdd = phenomenon => {

//         addPublicPhenomenaToRadar(phenomenon, successfullyCreatedCallback)
//     }

//     const hideAddForm = () => setcreateModalShown(false)
//     const bumpResetFilters = () => setresetFilters(resetFilters => resetFilters + 1)

//     const renderCreateModal = () => {
//         return (
//             <>
//                 <Modal isOpen={createModalShown}
//                    contentLabel={'Create phenomena'}
//                    style={modalStyles}
//                    ariaHideApp={false}
//                    onRequestClose={hideAddForm}
//                 >
//                     <PhenomenonEditForm
//                         createOrEditMode={true}
//                         onSubmit={(values, newsFeedChanges) => {
//                             storePhenomenon(values, newsFeedChanges, phenomenon => {
//                                 console.log('phenomenon', phenomenon)
//                                 hideAddForm()
//                                 changeAddPhenomenaVisibility()
//                                 onPhenomenaDrag(false, phenomenon, true)
//                             })
//                         }}
//                         onCancel={hideAddForm}
//                         onDelete={() => {}}
//                         radar={radar}
//                     />
//                 </Modal>

//                 {/* <PhenomenaTagSelector
//                     group={radar?.groupId}
//                     language={radar?.language}
//                     isInEditMode={true}
//                     editModal={{
//                         type: 'EDIT',
//                         uuid: null
//                     }}
//                 /> */}
//             </>
//         )
//     }

//         return (
//             <Draggable handle=".handle">
//                 <ListContainer
//                     className={'add-phenomena-to-radar'}
//                     style={{
//                         zIndex: placing ? 0 : 1,
//                         opacity: placing ? 0.8 : 1
//                     }}
//                 >
//                     <Container className='flex-shrink-0 handle' style={{ cursor: 'move' }}>
//                         <h3 className='radar-widget-title mb-0'>
//                             {requestTranslation('sandboxTitle')}
//                         </h3>
//                     </Container>
//                     <ListClose onClick={changeAddPhenomenaVisibility}>
//                         <CloseIcon className='material-icons'>close</CloseIcon>
//                     </ListClose>
//                     <Container className={'phenomena-list-container'} filtersShown={filtersShown}>
//                         <PhenomenaSelector
//                             radarId={radarId}
//                             language={language}
//                             onSelect={handlePhenomenaSelection}
//                             onCreate={handleCreateNew}
//                             selectedPhenomena={selectedPhenomena}
//                             onAddToRadarClick={handleAdd}
//                             sandbox
//                             filter
//                             filtersShown={filtersShown}
//                             handleFilterChange={() => setfiltersShown((filtersShown) => !filtersShown)}
//                             resetFilters={resetFilters}
//                             bumpResetFilters={bumpResetFilters}
//                             radarLanguage={radarLanguage}
//                         />
//                     </Container>
//                     {filtersShown ? (
//                         <Container filtersShown={filtersShown}>
//                             <button className='btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center' onClick={bumpResetFilters}>
//                                 <i className='material-icons mr-1' style={{ fontSize: '16px' }}>replay</i>
//                                 {requestTranslation('resetFilters')}
//                             </button>
//                         </Container>
//                     ) : (
//                         <Container className='d-flex flex-shrink-0'>
//                             <button
//                               onClick={handleCreateNew}
//                               className='btn btn-outline-secondary'
//                             >
//                               {requestTranslation("addNewPhenomena")}
//                             </button>
//                             <button className='btn btn-primary ml-auto'
//                                     onClick={changeAddPhenomenaVisibility}>
//                                 {requestTranslation('done')}
//                             </button>
//                         </Container>
//                     )}
//                     {renderCreateModal()}
//                 </ListContainer>
//             </Draggable>
//         )
//     }

//     export default AddPhenomenaSandbox