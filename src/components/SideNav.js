import React, {PureComponent} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import {paddingModalStyles, modalStyles} from '@sangre-fp/ui'
import drupalApi from '@sangre-fp/connectors/drupal-api'
import {PUBLIC_URL} from '../env'
import {Modal, PopupContainer} from '@sangre-fp/ui'
import {requestTranslation} from '@sangre-fp/i18n'
import {
    PAGE_BASIC_SETTINGS,
    PAGE_CONCLUSIONS,
    PAGE_HEADER_AND_LANGUAGE,
    PAGE_USER_OPTIONS
} from './CreateRadarForm'
import ShareRadarModal from '../containers/ShareRadarModalContainer'
import PublicLink from './PublicLink/PublicLink' 
import ConfirmationModal from './ConfirmationModal/ConfirmationModal'
import DeleteConfirmationModal from './DeleteConfirmationModal/DeleteConfirmationModal'
import SharedLinkModalAfterDelete from './SharedLinkModalAfterDelete/SharedLinkModalAfterDelete'


class SideNav extends PureComponent {
    state = {
        deletingModalOpen: false,
        sharingModalOpen: false,
        clonedModalOpen: false,
        generatingModalOpen: false,
        publicLinkModal: false,
        confirmationModal: false,
        deleteConfirmationModal: false,
        publicSharedLink: null,
        publicSharedUserInfo: [],
        radarShareId: null,
        publicSharedLinkExsited: false,
        SharedLinkModalAfterDelete: false,
        radarTitle: '',
        isPublicShareUrlEnabled: false
    }

    async componentDidMount() {
        const searchParams = new URLSearchParams(document.location.search)
        const shareQuery = Number(searchParams.get('share'))
        const node = Number(searchParams.get('node'))

        if (shareQuery ==='1' || shareQuery === 1) {
            await drupalApi.getRadarPublicShare(node).then((data) => {
                this.setState({
                    publicSharedLink: data.url,
                    publicSharedLinkExsited: true
    
                })
            })

            this.setState({ publicLinkModal: true })
        }
    }

    componentDidUpdate(nextProps, nextState) {
        const {radarSettings: {radarName}, groupId} = this.props
        this.setState({
            groupId: groupId,
            radarTitle: radarName
        })

        this.props.radarSettings.groups.map(g => {
            if (String(g?.id) === String(this.props.radarSettings?.group.id) && Number(g?.publicShareUrlEnabled) === 1) {
                this.setState({
                    isPublicShareUrlEnabled: true
                })
            }
        })
      }
      
    toggleOpenEditMenu = () => {
        const {toggleEditMenuVisiblity, editMenuOpen} = this.props

        toggleEditMenuVisiblity(!editMenuOpen)
    }

    handleCloseClick = () => {
        const {
            editSectorsPageOpen,
            sectorPageHandler,
            editTimeRangesPageOpen,
            timerangePageHandler
        } = this.props

        if (editSectorsPageOpen) {
            sectorPageHandler()
        }

        if (editTimeRangesPageOpen) {
            timerangePageHandler()
        }
    }

    clonedRadarCallback = newRadarHref => this.setState({clonedModalOpen: newRadarHref})

    closeRadar = (redirect = true) => {
        const {getReturnUrl} = this.props

        if (redirect) {
            document.href = getReturnUrl()
        }
        return getReturnUrl()
    }

    closePublicLink = () => {
        this.setState({ 
            publicLinkModal: false,
            sharingModalOpen: true
        })
      }

    openPublicLinkModal = async () => {
        this.setState({ sharingModalOpen: false })
        this.setState({ publicLinkModal: true })
        const searchParams = new URLSearchParams(document.location.search)
        const node = Number(searchParams.get('node'))

        // create a shared link
        if(this.state.publicSharedLink === null) {
            await drupalApi.createOrReplaceRadarPublicShare({radarId: node}).then((data) => {
                this.setState({
                    publicSharedLink: data?.url,
                    publicSharedLinkExsited: true
                })
            })
        }
        else {
            await drupalApi.getRadarPublicShare(node).then((data) => {
                this.setState({
                    publicSharedLink: data.url,
                    publicSharedLinkExsited: true
    
                })
            })
        }
    }

    onRegeneratePublicLink = async () => {
        const searchParams = new URLSearchParams(document.location.search)
        const node = Number(searchParams.get('node'))
        await drupalApi.regenerateRadarPublicShare(node).then(data => {
            this.setState({
                publicSharedLink: data.url,
                confirmationModal: false
            })
        })
    }

    openConfirmationModal = () => {
        this.setState({
            confirmationModal: true,
            publicLinkModal: false
        })
    }

    closeConfirmationModal= () => {
        this.setState({
            confirmationModal: false,
            publicLinkModal: true
        })
    }
   
    openDeleteConfirmationModal = () => {
        this.setState({
            deleteConfirmationModal: true, 
            publicLinkModal: false

        })
    }

    closeDeleteConfirmationModal= () => {
        this.setState({
            deleteConfirmationModal: false,
            publicLinkModal: true
        })
    }

    onDeletePublicLink = async () => {
        const searchParams = new URLSearchParams(document.location.search)
        const node = Number(searchParams.get('node'))

        await drupalApi.removeRadarPublicShare(node).then((data) => {
            this.setState({
                publicSharedLink: null,
                deleteConfirmationModal: false,
                publicSharedLinkExsited: false,
                SharedLinkModalAfterDelete: true
            })
        })
        
    }
    onCloseSharedLinkModalAfterDelete = () => {
        this.setState({
            SharedLinkModalAfterDelete: false
        })
    }

    onShareRadarClick = async() => {
        const searchParams = new URLSearchParams(document.location.search)
        const node = Number(searchParams.get('node'))
  
        //get shared link 
        await drupalApi.getRadarPublicShare(node).then((data) => {
            this.setState({
                publicSharedLink: data.url
            })
        })

        if(this.state.publicSharedLink !== null) {
            this.setState({
                publicSharedLinkExsited: true
            })
            
        }
        this.setState({sharingModalOpen: true})

    }

    sleep  = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    render() {
        const params = new URLSearchParams(window.location.search)
        let returnId = params.get('ret_id')
        if (returnId) {
            returnId = returnId.replace(/[^a-f0-9-]/, '')
        }
        const {deletingModalOpen, clonedModalOpen, sharingModalOpen, generatingModalOpen, publicLinkModal, confirmationModal, deleteConfirmationModal, radarShareId } = this.state
        const {
            changeAddRadarFormVisibility,
            sectorPageHandler,
            timerangePageHandler,
            deleteRadar,
            changeAddPhenomenaVisibility,
            editSectorsPageOpen,
            id,
            groupId,
            addRadarFormOpen,
            editPhenomenaVisible,
            editMenuOpen,
            toggleEditMenuVisiblity,
            canEditRadar,
            canDeleteRadar,
            cloneRadar,
            changeSignalListVisibility,
            signalListVisible,
            signalToolEnabled,
            isVisitor,
            canShareRadar,
            collaborationToolsAllowed,
            generatePowerpoint
        } = this.props

        const renderRadarEditor = !editSectorsPageOpen && !addRadarFormOpen && !editPhenomenaVisible && !signalListVisible && !isVisitor

        return (
            <PopupContainer onClose={toggleEditMenuVisiblity}>
                {renderRadarEditor &&
                <Container id='radar-nav-topright'>
                    <div className='nav-item'>
                        <a
                            onClick={() => this.closeRadar()}
                            href={this.closeRadar(false)}
                            className='btn-icon-lg'
                        >
                            <span className='af-custom-close'/>
                        </a>
                    </div>
                    {canEditRadar &&
                    <div>
                        <Edit
                            className='nav-item'
                            onClick={this.toggleOpenEditMenu}
                        >
                            <button
                                className='btn-round btn-lg'
                                onClick={this.toggleOpenEditMenu}
                            >
                                <span className='af-custom-edit'/>
                                {editMenuOpen &&
                                <EditMenu className='fp-dropdown-menu'>
                                    <EditTriangle className='fp-dropdown-menu-arrow'/>
                                    <div>
                                        <EditMenuHeader
                                            className='fp-dropdown-header'
                                            style={{lineHeight: "1.2rem"}}
                                        >
                                            {requestTranslation('layoutHeader')}
                                        </EditMenuHeader>
                                        <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={sectorPageHandler}
                                        >
                                            {requestTranslation('editSectors')}
                                        </EditMenuItem>
                                        <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={timerangePageHandler}
                                        >
                                            {requestTranslation('editTimeranges')}
                                        </EditMenuItem>
                                        <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={changeAddPhenomenaVisibility}
                                        >
                                            {requestTranslation('addPhenomena')}
                                        </EditMenuItem>
                                    </div>
                                    <div>
                                        <EditMenuHeader className='fp-dropdown-header'>
                                            {requestTranslation('settingsHeader')}
                                        </EditMenuHeader>
                                        <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={() => changeAddRadarFormVisibility(PAGE_BASIC_SETTINGS)}
                                        >
                                            {requestTranslation('editBasicSettings')}
                                        </EditMenuItem>
                                        <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={() => changeAddRadarFormVisibility(PAGE_HEADER_AND_LANGUAGE)}
                                        >
                                            {requestTranslation('editTitle')}
                                        </EditMenuItem>
                                        <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={() => changeAddRadarFormVisibility(PAGE_CONCLUSIONS)}
                                        >
                                            {requestTranslation('editConclusions')}
                                        </EditMenuItem>
                                    </div>
                                    {collaborationToolsAllowed &&
                                    <div>
                                        <EditMenuHeader className='fp-dropdown-header'>
                                            {requestTranslation('activateUsersHeader')}
                                        </EditMenuHeader>
                                        <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={() => changeAddRadarFormVisibility(PAGE_USER_OPTIONS)}
                                        >
                                            {requestTranslation('activateUsers')}
                                        </EditMenuItem>
                                        <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={() => window.location.replace(`${PUBLIC_URL}/send-message?map_id=${id}`)}
                                        >
                                            {requestTranslation('sendMessages')}
                                        </EditMenuItem>
                                    </div>
                                    }
                                    <div>
                                        <EditMenuHeader className='fp-dropdown-header'>
                                            {requestTranslation('managmentHeader')}
                                        </EditMenuHeader>
                                        <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={() => this.setState({generatingModalOpen: true})}
                                        >
                                            {requestTranslation('pptxGenerateReport')}
                                        </EditMenuItem>
                                        
                                        {
                                            canShareRadar && <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={this.onShareRadarClick}
                                        >
                                            {requestTranslation('shareRadar')}
                                        </EditMenuItem>
                                        }
                                        <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={() => cloneRadar(this.clonedRadarCallback)}
                                        >
                                            {requestTranslation('cloneRadar')}
                                        </EditMenuItem>
                                        {canDeleteRadar &&
                                        <EditMenuItem
                                            className='fp-dropdown-item'
                                            onClick={() =>
                                                this.setState({deletingModalOpen: true})
                                            }
                                        >
                                            {requestTranslation('deleteRadar')}
                                        </EditMenuItem>
                                        }

                                    </div>
                                </EditMenu>
                                }
                            </button>
                        </Edit>
                    </div>
                    }
                    <div className='nav-item'>
                        <a href={`${PUBLIC_URL}/node/${id}/results` + (returnId ? ('?ret_id=' + returnId) : '')}
                           onClick={() =>
                               window.location.replace(`${PUBLIC_URL}/node/${id}/results` + (returnId ? ('?ret_id=' + returnId) : ''))
                           }
                           className='btn-round btn-lg'>
                            <span className='af-custom-results'/>
                        </a>
                    </div>
                    {signalToolEnabled &&
                    <div className='nav-item'>
                        <div className='btn-round btn-lg' onClick={() => changeSignalListVisibility()}>
                            <span className='af-custom-signal-tool'/>
                        </div>
                    </div>
                    }
                </Container>
                }
                {editSectorsPageOpen &&
                <CloseButton
                    onClick={this.handleCloseClick}
                    className='btn btn-lg btn-primary'
                >
                    {requestTranslation('close')}
                </CloseButton>
                }
                <Modal
                    isOpen={generatingModalOpen}
                    contentLabel='generate powerpoint'
                    style={paddingModalStyles}
                    className='paddedModal'
                    ariaHideApp={false}
                >
                    <div className={'confirmation-modal-content'}>
                        <h3>
                            {requestTranslation('download')}
                        </h3>
                        <p>{requestTranslation('downloadPPTXDescription')}</p>
                        <div className={'d-flex align-items-center justify-content-end'}>
                            <button className='btn btn-lg btn-plain-gray'
                                    onClick={() => this.setState({generatingModalOpen: false})}>
                                {requestTranslation('cancel')}
                            </button>
                            <button className='btn btn-lg btn-primary'
                                    onClick={() => {
                                        try {
                                            const a = document?.getElementById('onetrust-accept-btn-handler')
                                            const wrapperCookieBar = document.getElementById("onetrust-banner-sdk") ?? null;
                                            const heightOfWrapperCookieBar = !!wrapperCookieBar && window?.getComputedStyle(wrapperCookieBar)?.getPropertyValue('height')
                                            if (!!a && !!heightOfWrapperCookieBar && String(heightOfWrapperCookieBar) !== '0px') { 
                                                a.click()
                                                localStorage.setItem('is-user-clicked', false)
                                                this.sleep(15000).then(() => {
                                                    if(!!document) {
                                                        document.cookie = 'OptanonAlertBoxClosed' + '=; Max-Age=0'
                                                    }     
                                                    else if (!!window){
                                                        window.cookie = 'OptanonAlertBoxClosed' + '=; Max-Age=0'
                                                    }
                                                });
    
                                            } else {
                                                localStorage.setItem('is-user-clicked', false)
                                                document.cookie = 'OptanonAlertBoxClosed=0'
                                            }
                                        } catch (error) {
                                            
                                        }
                                        this.setState({generatingModalOpen: false})
                                        generatePowerpoint(id, groupId)
                                    }}>
                                {requestTranslation('download')}
                            </button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={deletingModalOpen}
                    contentLabel='delete sanity check'
                    style={paddingModalStyles}
                    className={'paddedModal'}
                    ariaHideApp={false}
                >
                    <div className={'confirmation-modal-content'}>
                        <h3 className={'confirmation-modal-title'}>
                            {requestTranslation('deleteDoubleCheck')}
                        </h3>
                        <div className={'confirmation-modal-actions'}>
                            <button className='btn btn-lg btn-plain-gray'
                                    onClick={() => this.setState({deletingModalOpen: false})}>
                                {requestTranslation('cancel')}
                            </button>
                            <button className='btn btn-lg btn-primary'
                                    onClick={() => {
                                        this.setState({deletingModalOpen: false})
                                        deleteRadar()
                                    }}>
                                {requestTranslation('delete')}
                            </button>
                        </div>
                    </div>
                </Modal>
                {canShareRadar &&
                <Modal
                    isOpen={!!sharingModalOpen}
                    contentLabel='share radar'
                    style={modalStyles}
                    ariaHideApp={false}
                >
                    <ShareRadarModal 
                        requestClose={() => this.setState({sharingModalOpen: false})} 
                        requestOpenPublicLink={this.openPublicLinkModal} 
                        checkPublicLinkExsited={this.state.publicSharedLinkExsited} 
                        publicLink={this.state.publicSharedLink} 
                        isPublicShareUrlEnabled ={this.state.isPublicShareUrlEnabled}
                    />
                </Modal>
                }
                <Modal
                    isOpen={!!clonedModalOpen}
                    contentLabel='cloned radar'
                    style={paddingModalStyles}
                    className={'paddedModal'}
                    ariaHideApp={false}
                >
                    <div className={'confirmation-modal-content'}>
                        <h3 className={'confirmation-modal-title'}>
                            {requestTranslation('clonedRadarSuccess')}
                        </h3>
                        <p className='text-center'>
                            {requestTranslation('clonedRadarSuccessDescription')}
                        </p>
                        <div className={'confirmation-modal-actions'}>
                            <a className='btn btn-lg btn-primary' href={clonedModalOpen}>
                                {requestTranslation('clonedGoToCreated')}
                            </a>
                            <button className='btn btn-lg btn-plain-gray'
                                    onClick={() => this.setState({clonedModalOpen: false})}>
                                {requestTranslation('clonedContinueWithCurrent')}
                            </button>
                        </div>
                    </div>
                </Modal>
                <PublicLink 
                    isModalOpen={publicLinkModal} 
                    onRequestClose={this.closePublicLink} 
                    publicURL={this.state.publicSharedLink || 'Loading...'} 
                    openConfirmationModal={this.openConfirmationModal} 
                    openDeleteConfirmationModal={this.openDeleteConfirmationModal}
                />
                <ConfirmationModal 
                    confirmationModal={confirmationModal}
                    confirmationModalClose={this.closeConfirmationModal}
                    regeneratePublicLink={() => {this.onRegeneratePublicLink()}}
                />
                <DeleteConfirmationModal 
                    deleteConfirmationModal={deleteConfirmationModal}
                    deleteConfirmationModalClose={this.closeDeleteConfirmationModal}
                    deletePublicLink={() => this.onDeletePublicLink()}
                />
                <SharedLinkModalAfterDelete 
                    SharedLinkModalAfterDelete={this.state.SharedLinkModalAfterDelete}
                    SharedLinkModalAfterDeleteClose={this.onCloseSharedLinkModalAfterDelete}
                    RadarTitle={this.state.radarTitle}
                />
            </PopupContainer>
        )
    }
}

const CloseButton = styled.div`
    position: absolute;
    right: 30px;
    bottom: 30px;
    color: white;
`

const Container = styled.div`
    position: absolute;
    top: 25px;
    right: 25px;
`

const EditTriangle = styled.span`
    background-color: white;
    position: absolute;
    transform: rotate(45deg);
    right: -18px;
    top: 63px;
    width: 40px;
    height: 40px;
`

const EditMenu = styled.div`
    width: 280px;
    display: flex;
    position: absolute;
    background-color: white;
    flex-direction: column;
    box-sizing: border-box;
    left: -320px;
    top: -60px;
`

const EditMenuItem = styled.div`
    background: transparent;
    font-size: 16px;
    padding: 15px 25px;
    color: black;
    font-weight: 500;
    box-sizing: border-box;
    transition: all 0.4s ease;
    &:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.1);
        transition: all 0.4s ease;
    }
`

const EditMenuHeader = styled.div`
    width: 100%;
    background: rgb(231, 231, 232);
    display: flex;
    padding: 15px 25px;
    align-items: center;
    color: black;
    font-weight: 700;
    font-size: 18px;
    box-sizing: border-box;
`

const Edit = styled.div`
    position: relative;
    min-width: 20px;
    min-height: 20px;
    border-radius: 50%;
    background-color: #006998;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.4s ease;
    &:hover {
        cursor: pointer;
        background-color: #1A9AFC;
        transition: all 0.4s ease;
    }
`

export default SideNav
