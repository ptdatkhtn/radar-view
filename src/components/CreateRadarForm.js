import React, { PureComponent } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import Select from 'react-select'
import Toggle from 'react-toggle'
import {
    Loading,
    Radiobox,
    Checkbox
} from '@sangre-fp/ui'
import { requestTranslation } from '@sangre-fp/i18n'
import { radarLanguages, initialCommentTopics, customQuillModules } from '../config'
import { PUBLIC_URL } from '../env'
import ReactQuill from 'react-quill'
import filter from 'lodash/filter'
import find from 'lodash/find'
import first from 'lodash/first'
import times from 'lodash/times'
import { formats } from '../quill'
import classNames from 'classnames'
import {InfoCircle} from '@styled-icons/boxicons-regular'
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import styles from './CreateRadarForm.module.css'
import RatingSummaryPreview from './RatingSummaryPreview';
import AxisPreview from './AxisPreview';
import debounce from 'lodash/debounce'
import ConfirmationModalForRatings from './ConfirmationModalForRatings/ConfirmationModalForRatings'
import {HeaderContainer, Spacing} from './RatingSummaryPreview';
import RatingModalPreviewEditMode from './RatingModalPreviewEditMode/RatingModalPreviewEditMode'
import InformationModal from './InformationModal/InformationModal'
import CollaborationChartSetting from './CollaborationChartSetting/index';

const URL = window.URL || window.webkitURL

export const PAGE_HEADER_AND_LANGUAGE = 1
export const PAGE_BASIC_SETTINGS = 2
export const PAGE_USER_OPTIONS = 3
export const PAGE_CONCLUSIONS = 4

// TODO enable when implemented
const COMMENT_TOPICS_ENABLED = false
const RATING_ARROWS_ENABLED = false

//mock data
// export const mockDataOption = [
//     {value: 'Time', label: 'Time'},
//     {value: 'Probability', label: 'Probability'},
//     {value: 'Fit with current strategy', label: 'Fit with current strategy'},
//     {value: 'Direction of the trend', label: 'Direction of the trend'},
//     {value: 'Importance', label: 'Importance'},
//     {value: 'Impact1', label: 'Impact'},
//     {value: 'Impact2', label: 'Impact'},
//     {value: 'Nature1', label: 'Nature'},
//     {value: 'Nature2', label: 'Nature'},
//     {value: 'Speed of change', label: 'Speed of change'},
//     {value: 'Size of threat/risk', label: 'Size of threat/risk'},
//     {value: 'Size of opportunity', label: 'Size of opportunity'},
//     {value: 'Nature3', label: 'Nature'},
//     {value: 'Fit with existing capabilities', label: 'Fit with existing capabilities'},
//     {value: 'Magnitude of actions required', label: 'Magnitude of actions required'},
//     {value: 'Custom', label: 'Custom'}
// ]
export const mockData= [
    {
        title: 'Time: Near term/Long term',
        label: 'Time: Near term/Long term',
        nameAxis: 'Time',
        leftAttr: 'Near term',
        rightAttr: 'Long term'
    },
    {
        title: 'Probability: Low/High ',
        label: 'Probability: Low/High',
        nameAxis: 'Probability',
        leftAttr: 'Low',
        rightAttr: 'High'
    },
    {
        title: 'Fit with current strategy: Near term/long term',
        label: 'Fit with current strategy: Near term/Long term',
        nameAxis: 'Fit with current strategy',
        leftAttr: 'Near term',
        rightAttr: 'Long term'
    },
    {
        title: 'Fit with new strategy: Weak/Strong',
        label: 'Fit with new strategy: Weak/Strong',
        nameAxis: 'Fit with new strategy',
        leftAttr: 'Weak',
        rightAttr: 'Strong'
    },
    {
        title: 'Direction of the trend: Weakening/Increasing',
        label: 'Direction of the trend: Weakening/Increasing',
        nameAxis: 'Direction of the trend',
        leftAttr: 'Weakening',
        rightAttr: 'Increasing'
    },
    {
        title: 'Importance: Low/High',
        label: 'Importance: Low/High',
        nameAxis: 'Importance',
        leftAttr: 'Low',
        rightAttr: 'High'
    },
    {
        title: 'Impact1: Moderate/Huge',
        label: 'Impact: Moderate/Huge',
        nameAxis: 'Impact',
        leftAttr: 'Moderate',
        rightAttr: 'Huge'
    },
    {
        title: 'Impact2: Local/Global',
        label: 'Impact: Local/Global',
        nameAxis: 'Impact',
        leftAttr: 'Local',
        rightAttr: 'Global'
    },
    {
        title: 'Nature1: Threat/Opportunity',
        label: 'Nature: Threat/Opportunity',
        nameAxis: 'Nature',
        leftAttr: 'Threat',
        rightAttr: 'Opportunity'
    },
    {
        title: 'Nature2: long term Trend/Emergent',
        label: 'Nature: long term Trend/Emergent',
        nameAxis: 'Nature',
        leftAttr: 'Long term trend',
        rightAttr: 'Emergent'
    },
    {
        title: 'Speed of change: Gradual/Tsunami',
        label: 'Speed of change: Gradual/Tsunami',
        nameAxis: 'Speed of change',
        leftAttr: 'Gradual',
        rightAttr: 'Tsunami'
    },
    {
        title: 'Size of threat/risk: Moderate/Huge',
        label: 'Size of threat/risk: Moderate/Huge',
        nameAxis: 'Size of threat/risk',
        leftAttr: 'Moderate',
        rightAttr: 'Huge'
    },
    {
        title: 'Size of opportunity: Moderate/Huge',
        label: 'Size of opportunity: Moderate/Huge',
        nameAxis: 'Size of opportunity',
        leftAttr: 'Moderate',
        rightAttr: 'Huge'
    },
    {
        title: 'Nature3: Non-disrupting/Disrupting',
        label: 'Nature: Non-disrupting/Disrupting',
        nameAxis: 'Nature',
        leftAttr: 'Non-disrupting',
        rightAttr: 'Disrupting'
    },
    {
        title: 'Fit with existing capabilities: Weak/Strong',
        label: 'Fit with existing capabilities: Weak/Strong',
        nameAxis: 'Fit with existing capabilities',
        leftAttr: 'Weak',
        rightAttr: 'Strong'
    },
    {
        title: 'Magnitude of actions required: Minor/Huge',
        label: 'Magnitude of actions required: Minor/Huge',
        nameAxis: 'Magnitude of actions required',
        leftAttr: 'Minor',
        rightAttr: 'Huge'
    },
    {
        title: 'Custom',
        label: 'Custom',
        nameAxis: 'Custom',
        leftAttr: 'X',
        rightAttr: 'Y'
    },
]


const useStyles = theme => ({
    popover: {
      pointerEvents: 'none',
      width: '40%'
    },
    paper: {
      padding: theme.spacing(1),
      backgroundColor: '#424242',
      color: '#fff',
      width: 'fit-content'
    },
  });
class CreateRadarForm extends PureComponent {
    state = {
        VotingAnchorEl: null,
        RatingAnchorEl: null,
        CommentingAnchorEl: null,
        DiscussionAnchorEl: null,
        VotingDescriptionDisplayed: false,
        RatingDescriptionDisplayed: false,
        CommentingDescriptionDisplayed: false,
        DiscussionDescriptionDisplayed: false,
        axisYSelect: '',
        axisXSelect: '',
        isCustomVertical: false,
        isCustomHorozol: false,
        widthContentWidth: 0,
        openClearAllFields: false,
        openRatingModalEditMode: false,
        openVotingInformationModal: false,
        openRatingInformationModal: false,
        openCommentingInformationModal: false,
        openDiscussionInformationModal: false,
        votingHaloOn: false
    }
    // state is getting set because we are implementing a cancel + save button
    constructor(props) {
        super(props)
        let group = false

        this.editorMode = React.createRef()

        if (props.group) {
            group = props.group
        } else if (props.groups.length > 0) {
            const searchParams = (new URL(document.location)).searchParams
            const groupId = Number(searchParams.get('gid'))

            if (groupId && find(props.groups, ({ value }) => Number(value) === Number(groupId))) {
                group = groupId
            } else {
                group = first(props.groups).value
            }
        }

        const {
            radarName, mapIntro, radarLanguage, radarSets, hideUsersFromTrial, radarImage, votingOn,
            ratingsOn, discussionOn, commentsOn, likingOn, votingUp, axisXTitle, axisXMin,
            axisXMax, axisYTitle, axisYMin, axisYMax, fourFieldsTopLeft, fourFieldsTopRight,
            fourFieldsBottomLeft, fourFieldsBottomRight, displayHaloWhenRating, titleLogo
        } = props


        this.state = {
            errors: [],
            phenomenaSet: radarSets.length ? radarSets[0].value : false,
            commentTopics: initialCommentTopics,
            radarTitleImage: titleLogo,
            group,
            radarName,
            mapIntro,
            radarLanguage,
            hideUsersFromTrial,
            radarImage,
            votingOn,
            ratingsOn,
            discussionOn,
            commentsOn,
            likingOn,
            votingUp,
            axisXTitle,
            axisXMin,
            axisXMax,
            axisYTitle,
            axisYMin,
            axisYMax,
            fourFieldsTopLeft,
            fourFieldsTopRight,
            fourFieldsBottomLeft,
            fourFieldsBottomRight,
            displayHaloWhenRating
        }
    }

    componentDidMount() {
        const { getRadarSets, getUserGroups, existingRadarPage, axisYTitle, axisXTitle, axisYMin, axisYMax, axisXMin, axisXMax } = this.props

        this.setState({
            widthContentWidth: +this.editorMode?.current?.offsetWidth
        })
        if (window) {
            window.addEventListener("resize", debounce(this.handleResize, 150));
        }
        
        if (!existingRadarPage) {
            getUserGroups()
            getRadarSets()
        }

        localStorage.removeItem('chartData')

        if (this.state.displayHaloWhenRating <= 20) {
            this.setState({
                votingHaloOn: true
            })
        } else {
            this.setState({
                votingHaloOn: false
            })
        }
        mockData.some(i => {
            if (String(axisYTitle) === requestTranslation('verticalAxisName')
                    && String(axisYMin) === requestTranslation('lowEnd')
                    && String(axisYMax) === requestTranslation('highEnd')) {
                this.setState({ 
                    axisYSelect: '',
                })
                return true
            }
            else if((String(axisYTitle) === String(i.nameAxis) || String(axisYTitle) === String(i.title))
                    && String(axisYMin) === String(i.leftAttr)
                    && String(axisYMax) === String(i.rightAttr)) {
                    this.setState({ 
                        axisYSelect: i?.title,
                        axisYTitle: i?.nameAxis
                    })
                    return true
                } 
            else {
                this.setState({ 
                    axisYSelect: 'Custom',
                })
            }
        })

        mockData.some(i => {
            if (String(axisXTitle) === requestTranslation('HorizontalAxisName')
                        && String(axisXMin) === requestTranslation('leftEnd')
                        && String(axisXMax) ===requestTranslation('rightEnd')) {
                    this.setState({ 
                        axisXSelect: '',
                    })
                    return true
            }
            else if((String(axisXTitle) === String(i.nameAxis) || String(axisXTitle) === String(i.title))
                    && String(axisXMin) === String(i.leftAttr)
                    && String(axisXMax) === String(i.rightAttr)) {
                    this.setState({ 
                        axisXSelect: i?.title,
                        axisXTitle: i?.nameAxis
                        
                    })
                    return true
                } 
            else {
                this.setState({ 
                    axisXSelect: 'Custom',
                })
            }
        })

    }

    handleResize = () => {
        this.setState({
            widthContentWidth: +this.editorMode?.current?.offsetWidth
        })
    }

    componentWillUnmount() {
        if (window) {
            window.removeEventListener("resize", this.handleResize);
            localStorage.removeItem('chartData')
        }
    }

    shouldSetDefaultRadarSet(nextProps) {
        const { phenomenaSet } = this.state
        const { radarSets } = this.props

        // receiving radarSets, set not selected yet
        if (nextProps.radarSets.length && !phenomenaSet) {
            return true
        }

        // already received radarSets, but they've changed (probably due to language change)
        if (radarSets.length && nextProps.radarSets !== radarSets) {
            // check if current selection is in new set
            return !find(
                nextProps.radarSets,
                radarSet => radarSet.value === phenomenaSet
            )
        }

        return false
    }

    componentWillReceiveProps(nextProps) {
        if (this.shouldSetDefaultRadarSet(nextProps)) {
            if (nextProps.radarSets.length) {
                const radarSet = first(nextProps.radarSets)
                const imageUrl = radarSet.logo_image || false
                this.setState({ phenomenaSet: radarSet.value, imageUrl })
            } else {
                this.setState({ phenomenaSet: true })
            }
        }

        if (nextProps.groups.length && !this.state.group) {
            const searchParams = (new URL(document.location)).searchParams
            const groupId = Number(searchParams.get('gid'))

            if (groupId && find(nextProps.groups, ({ value }) => Number(value) === Number(groupId))) {
                this.setState({ group: groupId })
            } else {
                this.setState({ group: first(nextProps.groups).value })
            }
        }
    }

    setFieldError = (field, hasError) => {
        const { errors } = this.state

        if (hasError) {
            if (errors.indexOf(field) < 0) {
                this.setState({ errors: [...errors, field] })
            }
        } else {
            this.setState({ errors: filter(errors, error => error !== field) })
        }

        return !hasError
    }

    validateRadarName = () => this.setFieldError('radarName', this.hasRadarNameError())

    validateGroup = () => this.setFieldError('group', this.hasGroupError())

    hasGroupError = () => {
        const { groups } = this.props
        const { group: groupValue } = this.state

        const group = find(groups, ({ value }) => value === groupValue)

        return group && !group.hasAvailableRadars
    }

    hasRadarNameError = () => !this.state.radarName

    validate() {
        const { addRadarFormPage } = this.props

        const errors = []

        if (addRadarFormPage === PAGE_HEADER_AND_LANGUAGE) {
            if (this.hasGroupError()) {
                errors.push('group')
            }
            if (this.hasRadarNameError()) {
                errors.push('radarName')
            }
        }

        this.setState({ errors })
        return errors.length === 0
    }

    handleRadarNameChange = e => this.setState({
        radarName: e.target.value
    }, () => this.validateRadarName())
    handleMapIntroChange = value => this.setState({ mapIntro: value })
    handleValueChange = value => e => this.setState({ [value]: e.target.value })
    handleRadarLanguageChange = ({ value }) => {
        const { changeRadarLanguage } = this.props
        changeRadarLanguage(value)
        this.setState({ radarLanguage: value })
    }
    handlePhenomenaSetChange = ({ value }) => {
        let { imageUrl } = this.state
        const { radarSets } = this.props
        const radarSet = find(radarSets, set => set.id === value)
        if (radarSet && radarSet.logo_image !== '') {
            imageUrl = radarSet.logo_image
        } else {
            imageUrl = false
        }
        this.setState({ phenomenaSet: value, imageUrl })
    }
    handleDisplayHaloWhenRatingChange = ({ value }) => this.setState({ displayHaloWhenRating: value })
    handleGroupChange = ({ value }) => this.setState({ group: value }, () => this.validateGroup())
    handleDiscussionOnChange = () => this.setState({ discussionOn: !this.state.discussionOn })
    handleVotingOnChange = () => this.setState({ votingOn: !this.state.votingOn })
    handleVotingHaloOnChange = () => {

        return this.setState({ 
            votingHaloOn: !this.state.votingHaloOn
        }, () => {
            if (!this.state.votingHaloOn) {
                this.setState({ 
                    displayHaloWhenRating: 999
                })
            }
        })
    }
    handleRatingsOnChange = () => this.setState({ ratingsOn: !this.state.ratingsOn })
    handleLikingOnChange = () => this.setState({ likingOn: !this.state.likingOn })
    handleCommentsOnChange = () => this.setState({ commentsOn: !this.state.commentsOn })
    handleVotingSelection = () => this.setState({ votingUp: !this.state.votingUp })
    handleHideUsersFromTrialClick = () =>
        this.setState({ hideUsersFromTrial: !this.state.hideUsersFromTrial })

    handleTopicChange = (topicLabel, checked) => {
        const { commentTopics } = this.state
        const updatedTopics = commentTopics.map(topic => topic.label === topicLabel
            ? { ...topic, checked }
            : topic
        )

        this.setState({ commentTopics: updatedTopics })
    }

    handleImageSelect = (e, file) => {
        const fileName = file || e.target.files[0]
        const reader = new FileReader()

        reader.onload = () => {
            let img = new Image()
            img.src = URL.createObjectURL(fileName)

            img.onload = () => {
                this.setState({
                    radarImage: reader.result,
                    imageFile: fileName,
                    imageUrl: false
                })
            }
        }
        reader.readAsDataURL(fileName)
    }

    handleTitleImageSelect = (e, file) => {
        const fileName = file || e.target.files[0]
        const reader = new FileReader()

        reader.onload = () => {
            let img = new Image()
            img.src = URL.createObjectURL(fileName)

            img.onload = () => {
                this.setState({
                    radarTitleImage: reader.result,
                    imageTitleFile: fileName
                })
            }
        }
        reader.readAsDataURL(fileName)
    }

    handleTitleImageDelete = () => {
        this.setState({
            radarTitleImage: false,
            imageTitleFile: false
        })
    }

    handleImageDelete = () => {
        this.setState({
            radarImage: false,
            imageFile: false,
            imageUrl: false
        })
    }

    handleNextClick = () => {
        const {
            addRadarFormPage,
            changeRadarLanguage,
            changeRadarName,
            changeMapIntro,
            changeAddRadarFormPage,
            changeHideUsersFromTrial,
            changeRadarImage,
            changeDiscussionOn,
            changeVotingOn,
            changeVotingUp,
            changeRatingsOn,
            changeRatingsSettings,
            changeCommentsOn,
            changeLikingOn,
            createRadar,
            changePhenomenaSet,
            changeRadarGroup,
            id,
            updateRadar,
            changeDisplayHaloWhenRating,
            isCollaborationToolsAllowed,
            changeRadarTitleImage
        } = this.props

        const {
            radarLanguage,
            radarName,
            mapIntro,
            hideUsersFromTrial,
            discussionOn,
            votingOn,
            votingUp,
            ratingsOn,
            commentsOn,
            likingOn,
            phenomenaSet,
            group,
            axisXTitle,
            axisXMax,
            axisXMin,
            axisYTitle,
            axisYMax,
            axisYMin,
            fourFieldsTopLeft,
            fourFieldsTopRight,
            fourFieldsBottomLeft,
            fourFieldsBottomRight,
            imageFile,
            imageTitleFile,
            displayHaloWhenRating
        } = this.state

        if (this.validate()) {
            // todo make these in a pagely manner:)
            switch (addRadarFormPage) {
                case PAGE_HEADER_AND_LANGUAGE:
                    changeRadarLanguage(radarLanguage)
                    changeRadarName(radarName)
                    changeRadarGroup(group)

                    if (!id) {
                        changeAddRadarFormPage(PAGE_BASIC_SETTINGS)
                    } else {
                        updateRadar()
                    }

                    break
                case PAGE_BASIC_SETTINGS:
                    changeRadarImage(imageFile)
                    changeRadarTitleImage(imageTitleFile)
                    changeHideUsersFromTrial(hideUsersFromTrial)
                    changePhenomenaSet(phenomenaSet)

                    if (!id) {
                        if (isCollaborationToolsAllowed(group)) {
                            changeAddRadarFormPage(PAGE_USER_OPTIONS)
                        } else {
                            createRadar()
                        }
                    } else {
                        updateRadar()
                    }

                    break
                case PAGE_USER_OPTIONS:
                    changeDisplayHaloWhenRating(displayHaloWhenRating)
                    changeDiscussionOn(discussionOn)
                    changeVotingOn(votingOn)
                    changeVotingUp(votingUp)
                    changeRatingsOn(ratingsOn)
                    changeRatingsSettings({
                        axisXTitle,
                        axisXMax,
                        axisXMin,
                        axisYTitle,
                        axisYMax,
                        axisYMin,
                        fourFieldsTopLeft,
                        fourFieldsTopRight,
                        fourFieldsBottomLeft,
                        fourFieldsBottomRight
                    })
                    changeCommentsOn(commentsOn)
                    changeLikingOn(likingOn)

                    if (!id) {
                        createRadar()
                    } else {
                        updateRadar()
                    }

                    break
                case PAGE_CONCLUSIONS:
                    changeMapIntro(mapIntro)

                    if (!id) {
                        changeAddRadarFormPage(PAGE_CONCLUSIONS)
                    } else {
                        updateRadar()
                    }

                    break
                default:
                    break
            }
        }
    }

    handleBackClick = () => {
        const { addRadarFormPage, changeAddRadarFormPage } = this.props
        const previousPage = addRadarFormPage - 1

        changeAddRadarFormPage(previousPage)
    }

    handleCloseClick = () => this.props.changeAddRadarFormVisibility()
    redirectUser = () => window.location.replace(PUBLIC_URL || '/')
    renderUserOptionsForm() {
        const {
            votingOn,
            ratingsOn,
            discussionOn,
            commentsOn,
            commentTopics,
            likingOn,
            votingUp,
            axisXTitle,
            axisXMin,
            axisXMax,
            axisYTitle,
            axisYMin,
            axisYMax,
            fourFieldsTopLeft,
            fourFieldsTopRight,
            fourFieldsBottomLeft,
            fourFieldsBottomRight,
            displayHaloWhenRating,
            VotingDescriptionDisplayed,
            RatingDescriptionDisplayed,
            CommentingDescriptionDisplayed,
            DiscussionDescriptionDisplayed,
            VotingAnchorEl,
            RatingAnchorEl,
            CommentingAnchorEl,
            DiscussionAnchorEl,
            axisYSelect,
            axisXSelect,
            openRatingModalEditMode,
            openVotingInformationModal,
            openRatingInformationModal,
            openCommentingInformationModal,
            openDiscussionInformationModal
        } = this.state

        const onHoverVotingIcon = (event) => {
            this.setState({
                VotingAnchorEl: event.currentTarget,
                VotingDescriptionDisplayed: true
            })
        }
        const onLeaveVotingIcon = () => {
            this.setState({
                VotingAnchorEl: null,
                VotingDescriptionDisplayed: false
            })
        }

        const onHoverRatingIcon = (event) => {
            this.setState({
                RatingAnchorEl: event.currentTarget,
                RatingDescriptionDisplayed: true
            })
        }
        const onLeaveRatingIcon = () => {
            this.setState({
                RatingAnchorEl: null,
                RatingDescriptionDisplayed: false
            })
        }

        const onHoverCommentingIcon = (event) => {
            this.setState({
                CommentingAnchorEl: event.currentTarget,
                CommentingDescriptionDisplayed: true
            })
        }
        const onLeaveCommentingIcon = () => {
            this.setState({
                CommentingAnchorEl: null,
                CommentingDescriptionDisplayed: false
            })
        }

        const onHoverDiscussionIcon = (event) => {
            this.setState({
                DiscussionAnchorEl: event.currentTarget,
                DiscussionDescriptionDisplayed: true
            })
        }
        const onLeaveDiscussionIcon = () => {
            this.setState({
                DiscussionAnchorEl: null,
                DiscussionDescriptionDisplayed: false
            })
        }

        // {
        //     title: 'Time: A/B',
        //     label: 'Time:A/B',
        //     nameAxis: Time,
        //     leftAttr: 'near term',
        //     rightAttr: 'long term'
        // }
        // label: i.label, value: i.title
        const handleDisplayVericalAxisRatingChange = ({ value }, isCustom) => {
            this.setState({
                isCustomVertical: isCustom,
            })
            mockData.some(i => {
                if (String(value) === 'Custom') {
                    this.setState({ 
                        axisYSelect: value
                    })
                    return true
                }
                else if(String(value) === String(i.title)) {
                    this.setState({ 
                        axisYSelect: value,
                        axisYTitle: i.nameAxis,
                        axisYMin: i.leftAttr,
                        axisYMax: i.rightAttr,
                    })
                }
            })
        }
        const handleDisplayHorizontalAxisRatingChange = ({ value }, isCustom) => {
            this.setState({
                isCustomHorozol: isCustom,
            })
            mockData.some(i => {
                if (String(value) === 'Custom') {
                    this.setState({ 
                        axisXSelect: value
                    })
                    return true
                }
                else if(String(value) === String(i.title)) {
                    this.setState({ 
                        axisXSelect: value,
                        axisXTitle: i.nameAxis,
                        axisXMin: i.leftAttr,
                        axisXMax: i.rightAttr,
                    })
                }
            })
    }

    const handleFlipHorizontalAndVerticalChange = () => {
        const retrievedObject = JSON.parse(localStorage.getItem('chartData'))
           if (retrievedObject) {
                const {
                    leftEndValue, 
                    rightEndValue, 
                    topEndValue, 
                    lowEndValue, 
                    horizontalAxisNameValue, 
                    verticalAxisNameValue,
                    topLeftValue, 
                    topRightValue, 
                    bottomLeftValue, 
                    bottomRightValue,
                    inputSelectedXValue,
                    inputSelectedYValue,
                    isEditHorizontal,
                    isVerticalEdit
                } = retrievedObject

                localStorage.setItem('chartData', JSON.stringify({
                    leftEndValue: lowEndValue, 
                    rightEndValue: topEndValue, 
                    topEndValue: rightEndValue, 
                    lowEndValue: leftEndValue, 
                    horizontalAxisNameValue: verticalAxisNameValue, 
                    verticalAxisNameValue: horizontalAxisNameValue,
                    topLeftValue, 
                    topRightValue, 
                    bottomLeftValue, 
                    bottomRightValue,
                    inputSelectedXValue: inputSelectedYValue,
                    inputSelectedYValue: inputSelectedXValue,
                    isVerticalEdit: isEditHorizontal,
                    isEditHorizontal: isVerticalEdit
                }));

                if (retrievedObject) {
                    this.setState({
                        axisXTitle: verticalAxisNameValue,
                        axisYTitle: horizontalAxisNameValue,
                        axisXMin: lowEndValue,
                        axisYMin: leftEndValue,
                        axisXMax: topEndValue,
                        axisYMax: rightEndValue,
                        axisXSelect: inputSelectedYValue,
                        axisYSelect: inputSelectedXValue,
                        isCustomHorozol: isVerticalEdit,
                        isCustomVertical: isEditHorizontal
                    })
                }
           }


        else {
            this.setState({
                axisXTitle: axisYTitle,
                axisYTitle: axisXTitle,
                axisXMin: axisYMin,
                axisYMin: axisXMin,
                axisXMax: axisYMax,
                axisYMax: axisXMax,
                axisXSelect: axisYSelect,
                axisYSelect: axisXSelect
            })
        }
    }

    const openVotingInformationModalHandle = () => {
        this.setState({
            openVotingInformationModal: true
        })
    }

    const closeVotingInformationModalHandle = () => {
        this.setState({
            openVotingInformationModal: false
        })
    } 
    const openRatingInformationModalHandle = () => {
        this.setState({
            openRatingInformationModal: true
        })
    }

    const closeRatingInformationModalHandle = () => {
        this.setState({
            openRatingInformationModal: false
        })
    } 

    const openCommentingInformationModalHandle = () => {
        this.setState({
            openCommentingInformationModal: true
        })
    }

    const closeCommentingInformationModalHandle  = () => {
        this.setState({
            openCommentingInformationModal: false
        })
    } 

    const openDiscussionInformationModalHandle = () => {
        this.setState({
            openDiscussionInformationModal: true
        })
    }

    const closeDiscussionInformationModalHandle  = () => {
        this.setState({
            openDiscussionInformationModal: false
        })
    } 

    const openClearAllFieldsModal = () => {
        this.setState({
            openClearAllFields: true
        })
    }

    const closeClearAllFieldsModal = () => {
        this.setState({
            openClearAllFields: false
        })
    } 
    
    const openRatingModalEditModeModal = () => {
        this.setState({
            openRatingModalEditMode: true
        })
    }

    const closeRatingModalEditModeModal = () => {
        this.setState({
            openRatingModalEditMode: false
        })
    }
    const clearAllFieldsBtn = () => {
        this.setState({
            axisXTitle: requestTranslation('HorizontalAxisName'),
            axisYTitle: requestTranslation('verticalAxisName'),
            axisXMin: requestTranslation('leftEnd'),
            axisYMin:requestTranslation('lowEnd'),
            axisXMax: requestTranslation('rightEnd'),
            axisYMax: requestTranslation('highEnd'),
            fourFieldsTopLeft: requestTranslation('topLeft'),
            fourFieldsTopRight:requestTranslation('topRight'),
            fourFieldsBottomLeft: requestTranslation('bottomLeft'),
            fourFieldsBottomRight: requestTranslation('bottomRight'),
            openClearAllFields: false,
            axisXSelect: '',
            axisYSelect: '',
            isCustomHorozol: false,
            isCustomVertical: false
        })

        localStorage.removeItem('chartData')
        
    }
        const { classes } = this.props;

        const handleRatingOffParantComp = (value) => {
            this.setState({
                ratingsOn: value,
                openRatingModalEditMode: value
            })
        }

        const receiveCheckedCustomData = (isVertical, isHorizontal) =>{
            this.setState({
                isCustomVertical: isVertical,
                isCustomHorozol: isHorizontal
            })
        }

        const handleUpdateStateWhenClickedDoneBtnInCreateRadarForm = () => {
            // mockData.some(i => {
            //     if (String(axisYTitle) === String('Vertical axis name') 
            //             && String(axisYMin) === String('Low end')
            //             && String(axisYMax) === String('High end')) {
            //         this.setState({ 
            //             axisYSelect: '',
            //         })
            //         return true
            //     }
            //     else if(String(axisYTitle) === String(i.title)
            //             && String(axisYMin) === String(i.leftAttr)
            //             && String(axisYMax) === String(i.rightAttr)) {
            //             this.setState({ 
            //                 axisYSelect: axisYTitle,
            //             })
            //             return true
            //         } 
            //     else {
            //         this.setState({ 
            //             axisYSelect: 'Custom',
            //         })
            //     }
            // })
    
            // mockData.some(i => {
            //     if (String(axisXTitle) === String('Horizontal axis name') 
            //                 && String(axisXMin) === String('Left end')
            //                 && String(axisXMax) === String('Right end')) {
            //             this.setState({ 
            //                 axisYSelect: '',
            //             })
            //             return true
            //     }
            //     else if(String(axisXTitle) === String(i.title)
            //             && String(axisXMin) === String(i.leftAttr)
            //             && String(axisXMax) === String(i.rightAttr)) {
            //             this.setState({ 
            //                 axisXSelect: axisXTitle,
            //             })
            //             return true
            //         } 
            //     else {
            //         this.setState({ 
            //             axisXSelect: 'Custom',
            //         })
            //     }
            // })
        }

        const handleEmitFlagToRefetchDataOfChart = (value) => {
            try {
                if (value) {
                    const { 
                        horizontalAxisNameValue, 
                        verticalAxisNameValue,
                        leftEndValue,
                        rightEndValue,
                        lowEndValue,
                        topEndValue,
                        topLeftValue,
                        topRightValue,
                        bottomLeftValue,
                        bottomRightValue,
                        inputSelectedXValue,
                        inputSelectedYValue
                    } = value
                    this.setState( () => {
                        return {
                            axisXTitle: horizontalAxisNameValue,
                            axisYTitle: verticalAxisNameValue,
                            axisXMin: leftEndValue,
                            axisYMin: lowEndValue,
                            axisXMax: rightEndValue,
                            axisYMax: topEndValue,
                            fourFieldsTopLeft: topLeftValue,
                            fourFieldsTopRight: topRightValue,
                            fourFieldsBottomLeft: bottomLeftValue,
                            fourFieldsBottomRight: bottomRightValue,
                            axisXSelect: inputSelectedXValue,
                            axisYSelect: inputSelectedYValue
                        }
                    })
                }
            } catch (error) {
                
            }
        }

        const inputVerticalAxisValue = String(axisYSelect) !== '' ? (this.state.isCustomVertical ? 'Custom' : axisYSelect) : ''
        const inputHorozoltalAxisValue = String(axisXSelect) !== '' ? (this.state.isCustomHorozol ? 'Custom' : axisXSelect) : ''
        return (
            <div className='modal-form-sections'>
                <div className='modal-form-section modal-form-header'>
                    <h2>
                        {requestTranslation('activateUsers')}
                    </h2>
                </div>
                <div className='modal-form-section'>
                    <SpaceBetween>
                        <CustomHalfWidth>
                            <div style={{display: 'flex'}}>
                                <h3>
                                    {requestTranslation('voting')}
                                </h3>
                                <InformationIcon 
                                    background={false}
                                    onMouseEnter={onHoverVotingIcon} 
                                    onMouseLeave={onLeaveVotingIcon}
                                    onClick={openVotingInformationModalHandle}
                                />
                               <Popover 
                                    className={classes.popover}
                                    classes={{
                                        paper: classes.paper,
                                    }}
                                    open={VotingDescriptionDisplayed || false}
                                    anchorEl={VotingAnchorEl} 
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                    }}
                                      onClose={onLeaveVotingIcon}
                                      disableRestoreFocus
                                >
                                    <HoverBox>{requestTranslation('InfoIconHover')}</HoverBox>
                                </Popover> 
                                
                                <InformationModal 
                                    InfoModalHeader={requestTranslation('VotingTool')}
                                    InfoModalNote={requestTranslation('InfoModalVotingNote')}
                                    InfoModalOpen={openVotingInformationModal}
                                    InfoModalClose={closeVotingInformationModalHandle}
                                    LearnMoreBtn={requestTranslation('LearnMoreVotingBtn')}
                                    GuideBtn={requestTranslation('GuideVotingBtn')}
                                    LearnMoreLink='https://info.futuresplatform.com/hub/how-to-vote'
                                    GuideLink='https://info.futuresplatform.com/hub/how-to-orginise-voting'
                                    InfoModalDescription={requestTranslation('InfoModalVotingContent')}
                                    InfoModalDescription2={requestTranslation('InfoModalVotingContent2')}
                                    InfoModalDescription3={requestTranslation('InfoModalVotingContent3')}
                                    InfoModalDescription4={requestTranslation('InfoModalVotingContent4')}
                                    InfoModalDescription5={requestTranslation('InfoModalVotingContent5')}

                                />
                            </div>
                            <SpaceBetween>
                                <p>
                                    {requestTranslation('createFormVotingDescription')}
                                </p>
                                <Toggle
                                    icons={false}
                                    defaultChecked={votingOn}
                                    onChange={this.handleVotingOnChange}
                                />
                            </SpaceBetween>
                        </CustomHalfWidth>
                        {RATING_ARROWS_ENABLED && votingOn && (
                            <HalfWidth>
                                <h4>
                                    {requestTranslation('arrows')}
                                </h4>
                                <SpaceBetween style={{ width: '200px' }}>
                                    <Radiobox
                                        label={requestTranslation('up')}
                                        value='up'
                                        checked={votingUp}
                                        onClick={this.handleVotingSelection}
                                    />
                                    <Radiobox
                                        label={requestTranslation('upDown')}
                                        value='updown'
                                        checked={!votingUp}
                                        onClick={this.handleVotingSelection}
                                    />
                                </SpaceBetween>
                            </HalfWidth>
                        )}
                    </SpaceBetween>
                    {votingOn && 
                    <UpVotesWrapper>
                        <CustomHalfWidth>
                            <SpaceBetween>
                                <p>
                                    {requestTranslation('upvotesForHalo')}
                                </p>
                                <Toggle
                                            icons={false}
                                            checked={this.state.votingHaloOn}
                                            defaultChecked={this.state.votingHaloOn}
                                            onChange={this.handleVotingHaloOnChange}
                                        />
                            </SpaceBetween>
                        {this.state.votingHaloOn &&
                        <SpaceBetween style={{ marginTop: '15px'}}>
                            <p style={{ marginRight: '30px'}}>{requestTranslation('upvotesForHaloDescription')}</p> 
                            <Select
                                searchable={false}
                                name='group'
                                className= {` ${styles['custom-react-select-height-att']} ${styles['custom-react-select-width-att']}` }
                                value={displayHaloWhenRating}
                                onChange={this.handleDisplayHaloWhenRatingChange}
                                options={times(20, value => ({ label: value + 1, value: value + 1 }))}
                                clearable={false}
                            />
                            
                        </SpaceBetween>
                        }
                            
                        </CustomHalfWidth>
                    </UpVotesWrapper>    
                    }
                </div>

                <div className='modal-form-section'>
                    <CustomHalfWidth>
                        <div style={{display: 'flex'}}>
                            <h3>
                                {requestTranslation('rating')}
                            </h3>
                            <InformationIcon 
                                background={true}
                                onMouseEnter={onHoverRatingIcon}
                                onMouseLeave={onLeaveRatingIcon}
                                onClick={openRatingInformationModalHandle}
                            />
                            <Popover 
                                className={classes.popover}
                                classes={{
                                    paper: classes.paper,
                                }}
                                open={RatingDescriptionDisplayed || false}
                                anchorEl={RatingAnchorEl} 
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                                }}
                                onClose={onLeaveRatingIcon}
                                disableRestoreFocus
                            >
                                <HoverBox>{requestTranslation('InfoIconHover')} </HoverBox>
                            </Popover> 
                            <InformationModal 
                                    InfoModalHeader={requestTranslation('RatingTool')}
                                    InfoModalNote={requestTranslation('InfoModalRatingNote')}
                                    InfoModalOpen={openRatingInformationModal}
                                    InfoModalClose={closeRatingInformationModalHandle}
                                    LearnMoreBtn={requestTranslation('LearnMoreRatingBtn')}
                                    GuideBtn={requestTranslation('GuideRatingBtn')}
                                    LearnMoreLink='https://info.futuresplatform.com/hub/how-to-rate'
                                    GuideLink='https://info.futuresplatform.com/hub/most-commonly-used-axis-for-rating'
                                    InfoModalDescription={requestTranslation('InfoModalRatingContent')}
                                    InfoModalDescription2={requestTranslation('InfoModalRatingContent2')}
                                    InfoModalDescription3={requestTranslation('InfoModalRatingContent3')}
                                    InfoModalDescription4={requestTranslation('InfoModalRatingContent4')}
                                    InfoModalDescription5={requestTranslation('InfoModalRatingContent5')}
                                />
                        </div>
                        <SpaceBetween>
                            <p>
                                {requestTranslation('createFormRatingDescription')}
                            </p>
                            <Toggle 
                                    icons={false}
                                    checked={ratingsOn}
                                    defaultChecked={ratingsOn}
                                    onChange={this.handleRatingsOnChange}
                            />
                        </SpaceBetween>
                        {/* <SpaceBetween> */}
                            {/* <p style={{marginTop: '12px'}}>{requestTranslation('IntructionsForNamingAxis')}</p> */}
                        {/* </SpaceBetween> */}
                    </CustomHalfWidth>
                    

                    {ratingsOn && (
                    <FullWidthBgContainer ref={this.editorMode} style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0 }}>
                        <SpaceBetween>
                            <HalfWidth>
                                <h4>
                                    {requestTranslation('verticalAxis')}
                                </h4>
                                <Columns>
                                    <Column>
                                        <Select
                                            placeholder={requestTranslation('selectValue')}
                                            searchable={false}
                                            name='group'
                                            className= {`${styles['custom-react-select-margin-bottom-att']}` }
                                            onChange={handleDisplayVericalAxisRatingChange}
                                            value={inputVerticalAxisValue}
                                            options={mockData.map(i => ({
                                                label: i.label, value: i.title
                                            }))}
                                            clearable={false}
                                        />
                                    </Column>
                                </Columns>   
                            </HalfWidth>
                            <HalfWidth>
                                <h4>
                                    {requestTranslation('horizontalAxis')}
                                </h4>
                                <Columns>
                                    <Column>
                                        <Select
                                            placeholder={requestTranslation('selectValue')}
                                            searchable={false}
                                            name='group'
                                            className= {`${styles['custom-react-select-margin-bottom-att']}` }
                                            value={inputHorozoltalAxisValue}
                                            onChange={handleDisplayHorizontalAxisRatingChange}
                                            options={mockData.map(i => ({
                                                label: i.label, value: i.title
                                            }))}
                                            clearable={false}
                                        />
                                    </Column>
                                </Columns>
                            </HalfWidth>
                        </SpaceBetween>
                    </FullWidthBgContainer>
                )}

                {ratingsOn && (
                    <FullWidthBgContainer 
                        
                        style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0 }}> 
                        <RatingSummaryPreview
                                    // bottomHeader = 'Preview for rating result and summary view'
                                    containerWidth = {+this.state.widthContentWidth - 50 - 16 + 32 - 2}
                                    containerHeight = {+this.state.widthContentWidth * 0.60}
                                    // containerWidth = {320}
                                    // containerHeight = {200}
                                    topLeft = {fourFieldsTopLeft}
                                    topRight = {fourFieldsTopRight}
                                    bottomLeft = {fourFieldsBottomLeft}
                                    bottomRight = {fourFieldsBottomRight}
                                    horizontalAxisName = {axisXTitle}
                                    leftEnd = {axisXMin}
                                    rightEnd = {axisXMax}
                                    verticalAxisName = {axisYTitle}
                                    topEnd = {axisYMax}
                                    lowEnd = {axisYMin}
                                />
                        <RatingGroupBtn style={{marginTop: '62px'}}>
                            <RatingHandleBtnGroup>
                                <HandleRatingsBtn className="btn btn-outline-secondary" onClick={openClearAllFieldsModal} >{requestTranslation('clearAllFieldsBtn')}</HandleRatingsBtn>
                                <HandleRatingsBtn className="btn btn-outline-secondary" onClick={handleFlipHorizontalAndVerticalChange}>{requestTranslation('FlipHorizontalVertical')}</HandleRatingsBtn>
                                <HandleRatingsBtn className="btn btn-outline-secondary" onClick={openRatingModalEditModeModal} >{requestTranslation('editManuallyBtn')}</HandleRatingsBtn>
                            </RatingHandleBtnGroup>
                        </RatingGroupBtn>
                        <ConfirmationModalForRatings 
                            ConfirmationModalNote= 'Are you sure to clear all fields?'
                            confirmationModal= {this.state.openClearAllFields}
                            confirmationModalClose = {closeClearAllFieldsModal}
                            confirmationModalHandleBtn = {clearAllFieldsBtn}
                        />
                        <RatingModalPreviewEditMode 
                            isRatingPreviewEditOpen={openRatingModalEditMode}
                            handleRatingOff={handleRatingOffParantComp}
                            ratingsOn={this.state.ratingsOn}
                            axisXTitle={axisXTitle}
                            axisXMin={axisXMin}
                            axisXMax={axisXMax}
                            axisYTitle={axisYTitle}
                            axisYMin={axisYMin}
                            axisYMax={axisYMax}
                            fourFieldsTopLeft={fourFieldsTopLeft}
                            fourFieldsTopRight={fourFieldsTopRight}
                            fourFieldsBottomLeft={fourFieldsBottomLeft}
                            fourFieldsBottomRight={fourFieldsBottomRight}
                            axisYSelect={inputVerticalAxisValue}
                            axisXSelect={inputHorozoltalAxisValue}
                            RatingAnchorEl={RatingAnchorEl}
                            RatingDescriptionDisplayed={RatingDescriptionDisplayed}
                            openClearAllFields={this.state.openClearAllFields}
                            widthContentWidth={+this.state.widthContentWidth  -(16 + 12) - (16 + 8) -16 -3}
                            onHoverRatingIcon={onHoverRatingIcon}
                            onLeaveRatingIcon={onLeaveRatingIcon}
                            handleDisplayVericalAxisRatingChange={handleDisplayVericalAxisRatingChange}
                            handleDisplayHorizontalAxisRatingChange={handleDisplayHorizontalAxisRatingChange}
                            handleFlipHorizontalAndVerticalChange={handleFlipHorizontalAndVerticalChange}
                            openClearAllFieldsModal={openClearAllFieldsModal}
                            closeClearAllFieldsModal={closeClearAllFieldsModal}
                            clearAllFieldsBtn={clearAllFieldsBtn}
                            handleRatingsOnChange={this.handleRatingsOnChange}
                            handleRatingPreviewEditModeClose={closeRatingModalEditModeModal}
                            passCheckedCustomData={receiveCheckedCustomData}
                            emitFlagToRefetchDataOfChart={handleEmitFlagToRefetchDataOfChart}
                            handleUpdateStateWhenClickedDoneBtnInCreateRadarForm={handleUpdateStateWhenClickedDoneBtnInCreateRadarForm}
                            isCustomVerticalProp={this.state.isCustomVertical}
                            isCustomHorozontalProp={this.state.isCustomHorozol}
                        />
                    </FullWidthBgContainer>
                )}
                </div>
     
                

                <div className='modal-form-section'>
                    <SpaceBetween>
                        <CustomHalfWidth>
                            <div style={{display: 'flex'}}>
                                <h3>
                                    {requestTranslation('commenting')}
                                </h3>
                                <InformationIcon 
                                    background={false}
                                    onMouseEnter={onHoverCommentingIcon}
                                    onMouseLeave={onLeaveCommentingIcon}
                                    onClick={openCommentingInformationModalHandle}
                                />
                                <Popover 
                                    className={classes.popover}
                                    classes={{
                                        paper: classes.paper,
                                    }}
                                    open={CommentingDescriptionDisplayed || false}
                                    anchorEl={CommentingAnchorEl} 
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                    }}
                                    onClose={onLeaveCommentingIcon}
                                    disableRestoreFocus
                                >
                                    <HoverBox>{requestTranslation('InfoIconHover')}</HoverBox>
                                </Popover>
                                <InformationModal 
                                    InfoModalHeader={requestTranslation('CommentingTool')}
                                    InfoModalNote={requestTranslation('InfoModalCommentingNote')}
                                    InfoModalOpen={openCommentingInformationModal}
                                    InfoModalClose={closeCommentingInformationModalHandle}
                                    LearnMoreBtn={requestTranslation('LearnMoreCommentingBtn')}
                                    GuideBtn={requestTranslation('GuideCommentingBtn')}
                                    LearnMoreLink='https://info.futuresplatform.com/hub/how-to-comment'
                                    GuideLink='https://info.futuresplatform.com/hub/how-to-organise-commenting'
                                    InfoModalDescription={requestTranslation('InfoModalCommentingContent')}
                                    InfoModalDescription2={requestTranslation('InfoModalCommentingContent2')}
                                    InfoModalDescription3={requestTranslation('InfoModalCommentingContent3')}
                                />
                            </div>
                            <SpaceBetween>
                                <p style={{marginRight:'30px'}}>
                                    {requestTranslation('createFormCommentingDescription')}
                                </p>
                                <Toggle
                                    icons={false}
                                    defaultChecked={commentsOn}
                                    onChange={this.handleCommentsOnChange}
                                />
                            </SpaceBetween>
                            {commentsOn && 
                                <SpaceBetween style={{ marginTop: '15px' }}>
                                    <p style={{marginRight:'30px'}}>
                                        {requestTranslation('allowLikeCommenting')}
                                    </p>
                                    <Toggle icons={false}
                                            defaultChecked={likingOn}
                                            onChange={this.handleLikingOnChange}
                                    />
                                </SpaceBetween>
                            }
                            
                        </CustomHalfWidth>
                        {commentsOn && COMMENT_TOPICS_ENABLED && (
                            <HalfWidth>
                                <h4>
                                    {requestTranslation('commentTopics')}
                                </h4>
                                <div>
                                    {commentTopics.map(({ label, checked }, index) => (
                                        <Checkbox key={index}
                                                  blue
                                                  label={label}
                                                  checked={checked}
                                                  onChange={() =>
                                                      this.handleTopicChange(label, !checked)
                                                  }/>
                                    ))}
                                </div>
                            </HalfWidth>
                        )}
                    </SpaceBetween>
                </div>
                <div className='modal-form-section'>
                        {/* <SpaceBetween> */}
                            <div>
                                <div style={{display: 'flex'}}>
                                    <h3 className='mb-0' style={{paddingBottom: '12.6px'}}>
                                        {requestTranslation('discussion')}
                                    </h3>
                                    <InformationIcon 
                                        background={true}
                                        onMouseEnter={onHoverDiscussionIcon}
                                        onMouseLeave={onLeaveDiscussionIcon}
                                        onClick={openDiscussionInformationModalHandle}
                                    />
                                    <Popover 
                                        className={classes.popover}
                                        classes={{
                                            paper: classes.paper,
                                        }}
                                        open={DiscussionDescriptionDisplayed || false}
                                        anchorEl={DiscussionAnchorEl} 
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                        }}
                                        onClose={onLeaveDiscussionIcon}
                                        disableRestoreFocus
                                    >
                                        <HoverBox>{requestTranslation('InfoIconHover')}</HoverBox>
                                    </Popover>
                                    <InformationModal 
                                        InfoModalHeader={requestTranslation('discussion')}
                                        InfoModalNote={requestTranslation('InfoModalDiscussionNote')}
                                        InfoModalOpen={openDiscussionInformationModal}
                                        InfoModalClose={closeDiscussionInformationModalHandle}
                                        LearnMoreBtn={requestTranslation('LearnMoreDiscussionBtn')}
                                        GuideBtn={requestTranslation('GuideDiscussionBtn')}
                                        LearnMoreLink='https://info.futuresplatform.com/hub/how-to-discuss'
                                        GuideLink='https://info.futuresplatform.com/hub/how-to-organise-discussion'
                                        InfoModalDescription={requestTranslation('InfoModalDiscussionContent')}
                                        InfoModalDescription2={requestTranslation('InfoModalDiscussionContent2')}
                                        InfoModalDescription3={requestTranslation('InfoModalDiscussionContent3')}
                                    />
                                </div>
                                <CustomHalfWidth>
                                    <SpaceBetween>
                                        <p style={{marginRight: '30px'}}>{requestTranslation('createFormDiscussionDescription')}</p>
                                        <Toggle icons={false}
                                                defaultChecked={discussionOn}
                                                onChange={this.handleDiscussionOnChange}
                                        />
                                    </SpaceBetween>
                                </CustomHalfWidth>
                            </div>
                        {/* </SpaceBetween> */}
                </div>
            </div>
        )
    }

    renderFieldError(field, props = {}) {
        const { errors } = this.state

        const hasError = errors.length > 0 && errors.indexOf(field) >= 0
        return hasError && (
            <FieldError {...props}>
                {requestTranslation(`radar-error-${field}`)}
            </FieldError>
        )
    }

    renderHeaderAndLanguageForm() {
        const { radarName, radarLanguage, group } = this.state
        const { groups, id } = this.props

        return (
            <div className='modal-form-sections'>
                <div className='modal-form-section modal-form-header'>
                    <h2>
                        {requestTranslation('headerTitle')}
                    </h2>
                </div>
                <div className='modal-form-section'>
                    <h3>
                        {requestTranslation('header')}
                    </h3>
                    <div className='form-group'>
                        <Input type={'text'}
                               value={radarName}
                               onChange={this.handleRadarNameChange}
                               style={{ maxWidth: '300px', display: 'inline-block' }}
                        />
                        {this.renderFieldError('radarName')}
                    </div>
                </div>
                <div className='modal-form-section lightgray-bg'>
                    <h3>
                        {requestTranslation('group')}
                    </h3>
                    {!id && (
                        <div className='form-group'>
                            <p>
                                {requestTranslation('groupAvailabilityText')}
                            </p>
                            <SelectWrapper>
                                <Select searchable={false}
                                        name='group'
                                        className='fp-radar-select'
                                        value={group}
                                        onChange={this.handleGroupChange}
                                        options={groups}
                                        clearable={false}
                                />
                            </SelectWrapper>
                            {this.renderFieldError('group', { select: true })}
                        </div>
                    )}
                    {id && (
                        <p>
                            {requestTranslation('groupAvailability')} {group.title}
                        </p>
                    )}
                </div>
                {!id && (
                    <div className='modal-form-section pb-0'>
                        <h3>
                            {requestTranslation('language')}
                        </h3>
                        <p>
                            {requestTranslation('languageAvailability')}
                        </p>
                        <Select searchable={false}
                                name='language'
                                className='fp-radar-select'
                                value={radarLanguage || radarLanguages()[0]}
                                onChange={this.handleRadarLanguageChange}
                                options={radarLanguages()}
                                clearable={false}
                                placeholder={requestTranslation('select').toLowerCase() + '...'}
                        />
                    </div>
                )}
            </div>
        )
    }

    renderConclusionForm = () => {
        const { mapIntro } = this.state

        return (
            <div className='modal-form-sections'>
                <div className='modal-form-section modal-form-header'>
                    <h2>
                        {requestTranslation('conclusions')}
                    </h2>
                </div>
                <div className='modal-form-section'>
                    <ReactQuill
                        className='fp-wysiwyg'
                        style={{
                            height: '250px',
                            paddingBottom: '42px'
                        }}
                        modules={customQuillModules}
                        formats={formats}
                        value={mapIntro ? mapIntro : ''}
                        onChange={this.handleMapIntroChange}
                    />
                </div>
            </div>
        )
    }

    renderBasicSettingsForm = () => {
        const { phenomenaSet, hideUsersFromTrial, radarImage, imageUrl, group, radarTitleImage } = this.state
        const { radarSets, id, groups, radarTitleImage: propsRadarTitleImage } = this.props
        // TODO: check why group can be either just an id, or an object with id key, drupal ??
        const renderTitleLogoInput = _.find(groups, ({ value }) => Number(value) === (Number(group) || Number(group.id)))

        return (
            <div className='modal-form-sections'>
                <div className='modal-form-section modal-form-header'>
                    <h2>
                        {requestTranslation('basicSettings')}
                    </h2>
                </div>
                {!id && (
                    <div className='modal-form-section'>
                        <h3>
                            {requestTranslation('selectPhenomenaSet')}
                        </h3>
                        <Select searchable={false}
                                name='phenomena-set'
                                className='fp-radar-select fp-radar-select-hizindex fp-radar-select--no-margin'
                                value={phenomenaSet}
                                onChange={this.handlePhenomenaSetChange}
                                options={radarSets}
                                clearable={false}
                        />
                    </div>
                )}
                <div className='modal-form-section'>
                    <h3>
                        {renderTitleLogoInput && renderTitleLogoInput.radarLogoEnabled
                            ? requestTranslation('selectRadarTitleImage') : requestTranslation('selectRadarImage')}
                    </h3>
                    <div className='form-group'>
                        <div className='d-flex w-100 justify-content-between'>
                            <SelectImageContainer>
                                {!(radarImage || imageUrl) && requestTranslation('noImageSelected')}
                                {(radarImage || imageUrl) && (
                                    <RadarImageContainer>
                                        <RadarImage src={imageUrl || radarImage}/>
                                        <RadarImageCloseContainer onClick={this.handleImageDelete}>
                                            <RadarImageClose className='material-icons'>close</RadarImageClose>
                                        </RadarImageCloseContainer>
                                    </RadarImageContainer>
                                )}
                                <SelectImageInputContainer>
                                    <SelectImageInput type='file'
                                                      accept='image/*'
                                                      onChange={this.handleImageSelect}
                                                      placeholder='SELECT'
                                                      onClick={event => {
                                                        event.target.value = null
                                                    }}
                                    />
                                    <SelectImageButton className='btn btn-sm btn-outline-secondary'>
                                        {requestTranslation('select')}
                                    </SelectImageButton>
                                </SelectImageInputContainer>
                            </SelectImageContainer>
                            {renderTitleLogoInput && renderTitleLogoInput.radarLogoEnabled ? (
                                <SelectImageContainer>
                                    {!(radarTitleImage || propsRadarTitleImage) && requestTranslation('noImageSelected')}
                                    {(radarTitleImage || propsRadarTitleImage) && (
                                        <RadarImageContainer>
                                            <RadarTitleImage src={radarTitleImage || propsRadarTitleImage}/>
                                            <RadarImageCloseContainer onClick={this.handleTitleImageDelete}>
                                                <RadarImageClose className='material-icons'>close</RadarImageClose>
                                            </RadarImageCloseContainer>
                                        </RadarImageContainer>
                                    )}
                                    <SelectImageInputContainer>
                                        <SelectImageInput type='file'
                                                          accept='image/*'
                                                          onChange={this.handleTitleImageSelect}
                                                          placeholder='SELECT'
                                                          onClick={event => {
                                                            event.target.value = null
                                                        }}
                                        />
                                        <SelectImageButton className='btn btn-sm btn-outline-secondary'>
                                            {requestTranslation('select')}
                                        </SelectImageButton>
                                    </SelectImageInputContainer>
                                </SelectImageContainer>
                            ) : null}
                        </div>
                        <p className='description'>
                            {requestTranslation('radarImageText')}
                        </p>
                    </div>
                </div>
                <div className={classNames('modal-form-section', { 'pb-0': !id })}>
                    <h3>
                        {requestTranslation('hideUserList')}
                    </h3>
                    <div className={classNames('form-group', { 'pb-0': !id })}>
                        <Checkbox whiteBg
                                  label={requestTranslation('hideUserListLabel')}
                                  checked={hideUsersFromTrial}
                                  onChange={this.handleHideUsersFromTrialClick}
                        />
                    </div>
                </div>
            </div>
        )
    }

    renderFormPage = () => {
        const { addRadarFormPage } = this.props

        switch (addRadarFormPage) {
            case PAGE_CONCLUSIONS:
                return this.renderConclusionForm()
            case PAGE_BASIC_SETTINGS:
                return this.renderBasicSettingsForm()
            case PAGE_USER_OPTIONS:
                return this.renderUserOptionsForm()
            default:
                return this.renderHeaderAndLanguageForm()
        }
    }

    renderNextButton() {
        const { errors } = this.state
        const { loading, existingRadarPage } = this.props

        const disabled = errors.length || loading.length
        const phrase = existingRadarPage ? 'save' : 'next'

        return (
            <button disabled={disabled}
                        className={'btn btn-lg btn-primary'}
                        onClick={this.handleNextClick}>
                {requestTranslation(phrase)}
            </button>
        )
    }

    renderCancelButton() {
        const { addRadarFormPage, existingRadarPage } = this.props
        const firstPage = addRadarFormPage === PAGE_HEADER_AND_LANGUAGE
        const phrase = existingRadarPage || firstPage ? 'cancel' : 'back'
        const onClick = firstPage ? this.redirectUser : this.handleBackClick

        return (
            <button className='btn btn-lg btn-plain-gray'
                          onClick={existingRadarPage ? this.handleCloseClick : onClick}>
                {requestTranslation(phrase)}
            </button>
        )
    }

    renderPagination() {
        const { addRadarFormPage, isCollaborationToolsAllowed } = this.props
        const { group: groupId } = this.state
        return (
            <Pagination>
                <PaginationLine />
                <PaginationNumber active={addRadarFormPage === PAGE_HEADER_AND_LANGUAGE}>
                    1
                </PaginationNumber>
                <PaginationNumber active={addRadarFormPage === PAGE_BASIC_SETTINGS}>
                    2
                </PaginationNumber>
                {isCollaborationToolsAllowed(groupId) && <PaginationNumber active={addRadarFormPage === PAGE_USER_OPTIONS}>
                    3
                </PaginationNumber>}
            </Pagination>
        )
    }

    render() {
        const { existingRadarPage, loading } = this.props

        return (
            <div>
                {this.renderFormPage()}
                <div className='modal-form-section modal-form-actions'>
                    <div>
                        {this.renderCancelButton()}
                        {this.renderNextButton()}
                    </div>
                </div>
                <Loading shown={loading.length} color={'black'} />
                {!existingRadarPage && this.renderPagination()}
            </div>
        )
    }
}
export default withStyles(useStyles)(CreateRadarForm)

const SelectWrapper = styled.div`
    display: inline-block;
    margin-right: 15px;
`

const FieldError = styled.div`
    margin-top: ${({ select }) => select ? '7px' : '0'};
    display: ${({ select }) => select ? 'block' : 'inline-block'};
    clear: right;
    color: red;
`

const Pagination = styled.div`
    position: absolute;
    top: 30px;
    right: 30px;
    display: flex;
    width: 100px;
    justify-content: space-between;
`

const PaginationLine = styled.div`
    width: 100%;
    height: 1px;
    background: gray;
    position: absolute;
    top: 50%;
    z-index: 1;
`

const PaginationNumber = styled.div`
    width: 23px;
    height: 23px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    padding-top: 0px;
    font-size: 13px;
    box-sizing: border-box;
    z-index: 10;
    background: ${props => props.active ? '#006998' : 'gray'};
`

const Input = styled.input`
    width: 300px;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.3);
    margin-right: 15px;
    font-size: 16px;
    padding-left: 20px;
    height: 45px;
    border-radius: 1px;
    box-sizing: border-box;
`

const FullWidthBgContainer = styled.div`
    width: 100%;
    background-color: #f1f3f3;
    box-sizing: border-box;
    padding: 30px 50px;
    &:after {
      content: "";
      display: table;
      clear: both;
    }
`

const SelectImageInputContainer = styled.div`
    position: relative;
    width: 100px;
    height: 40px;
    margin-left: 20px;
`

const SelectImageInput = styled.input`
    z-index: 20;
    width: 100%;
    height: 100%;
    opacity: 0;
    background: transparent;
    position: absolute;
    top: 0;
    left: 0;
    &:hover {
        cursor: pointer;
    }
`

const SelectImageButton = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 40px;
    border: 1px solid #006998;
    color: #006998;
    border-radius: 40px;
    background: transparent;
    font-size: 16px;
    font-weight: 700;
    &:hover {
        transition: all 0.4s ease;
        cursor: pointer;
        color: white;
        background-color: #006998;
    }
`

const SelectImageContainer = styled.div`
    display: flex;
    margin-bottom: 20px;
    align-items: center;
`

const RadarImage = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid transparent;
`

const RadarTitleImage = styled.img`
    height: 85px;
    width: auto;
    object-fit: contain;
    border: 1px solid transparent;
`

const RadarImageContainer = styled.div`
    position: relative;
    background-color: rgba(0,0,0, 0.1);
`

const RadarImageCloseContainer = styled.div`
    position: absolute;
    top: -15px;
    right: -15px;
    border-radius: 50%;
    background-color: #f1f3f3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid gray;
    &:hover {
        cursor: pointer;
    }
`

const RadarImageClose = styled.i`
    /*color: gray;*/
    opacity: 0.7;
`

const breakpoint = '767px'
const CustomHalfWidth = styled.div`
@media (min-width: ${breakpoint}) {
    width: 80%;
    display: flex;
    flex-direction: column;
}
`
const HalfWidth = styled.div`
    @media (min-width: ${breakpoint}) {
        width: 45%;
        display: flex;
        flex-direction: column;
    }
`

const SpaceBetween = styled.div`
    @media (min-width: ${breakpoint}) {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: row;
    }
`

const RatingGroupBtn = styled.div`
display: flex;
flex-direction: column;

    @media (min-width: ${breakpoint}) {
        display: flex;
        justify-content: space-between;
        // align-items: flex-start;
        flex-direction: row;
    }
`


const Label = styled.label`
    white-space: nowrap;
`

const columnPadding = 10
const Columns = styled.div`
    width: ${({ width }) => width ? width : 'auto'};
    display: flex;
    margin: 0 -${columnPadding}px 10px -${columnPadding}px;
`

const Column = styled.div`
    flex: 1 1 ${({ width }) => width ? width : '0%'};
    padding: 0 ${columnPadding}px;
`
const InformationIcon = styled(InfoCircle)`
    background-color: ${props => props.background ? '#f1f3f3': 'white'};
    color: black;
    width: 18px;
    height: 18px;
    margin-top: 4px;
    margin-left: 18px;
    &:hover {
        cursor: pointer;
    }
`

const DisplayFlex = styled.div`
    @media (min-width: ${breakpoint}) {
        display: flex;
    }
`

const UpVotesWrapper = styled.div`
    margin-top: 20px;
    @media (min-width: ${breakpoint}) {
        width: 100%;
    }
`
const HoverBox = styled.p`
    display: flex;
    flex-wrap: wrap;
    width: fit-content;
    justify-content: center;
    align-items: center;
    align-content: center;
    margin: auto; 
`
const HandleRatingsBtn = styled.button`
&:hover {
    background: #006998 !important;
    color: white !important;
}

margin-bottom: 10px;

    
`

const RatingHandleBtnGroup = styled.div`
display: flex;
flex-direction: column;

    @media (min-width: ${breakpoint}) {
        width: 83%;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
    }   

`
