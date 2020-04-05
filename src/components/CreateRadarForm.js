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

const URL = window.URL || window.webkitURL

export const PAGE_HEADER_AND_LANGUAGE = 1
export const PAGE_BASIC_SETTINGS = 2
export const PAGE_USER_OPTIONS = 3
export const PAGE_CONCLUSIONS = 4

// TODO enable when implemented
const COMMENT_TOPICS_ENABLED = false
const RATING_ARROWS_ENABLED = false

export default class CreateRadarForm extends PureComponent {
    // state is getting set because we are implementing a cancel + save button
    constructor(props) {
        super(props)
        let group = false

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
        const { getRadarSets, getUserGroups, existingRadarPage } = this.props

        if (!existingRadarPage) {
            getUserGroups()
            getRadarSets()
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
            displayHaloWhenRating
        } = this.state

        return (
            <div className='modal-form-sections'>
                <div className='modal-form-section modal-form-header'>
                    <h2>
                        {requestTranslation('activateUsers')}
                    </h2>
                </div>
                <div className='modal-form-section'>
                    <SpaceBetween>
                        <HalfWidth>
                            <h3>
                                {requestTranslation('voting')}
                            </h3>
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
                        </HalfWidth>
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
                    <div style={{ marginTop: '20px' }}>
                        <h4>
                            {requestTranslation('upvotesForHalo')}
                        </h4>
                        <Select
                            searchable={false}
                            name='group'
                            className='fp-radar-select'
                            value={displayHaloWhenRating}
                            onChange={this.handleDisplayHaloWhenRatingChange}
                            options={times(20, value => ({ label: value + 1, value: value + 1 }))}
                            clearable={false}
                        />
                    </div>
                </div>

                <div className='modal-form-section'>
                    <HalfWidth>
                        <h3>
                            {requestTranslation('rating')}
                        </h3>
                        <SpaceBetween>
                            <p>
                                {requestTranslation('createFormRatingDescription')}
                            </p>
                            <Toggle icons={false}
                                    defaultChecked={ratingsOn}
                                    onChange={this.handleRatingsOnChange}
                            />
                        </SpaceBetween>
                    </HalfWidth>
                </div>

                {ratingsOn && (
                    <FullWidthBgContainer style={{ paddingTop: 0 }}>
                        <SpaceBetween>
                            <HalfWidth>
                                <h4>
                                    {requestTranslation('horizontalAxis')}
                                </h4>
                                <Columns>
                                    <Column>
                                        <Label>
                                            {requestTranslation('axisName')}
                                        </Label>
                                        <Input type={'text'}
                                               value={axisXTitle || ''}
                                               onChange={this.handleValueChange('axisXTitle')}/>
                                    </Column>
                                </Columns>
                                <Columns>
                                    <Column>
                                        <Label>
                                            {requestTranslation('leftEnd')}
                                        </Label>
                                        <Input type={'text'}
                                               value={axisXMin || ''}
                                               onChange={this.handleValueChange('axisXMin')}/>
                                    </Column>
                                    <Column>
                                        <Label>
                                            {requestTranslation('rightEnd')}
                                        </Label>
                                        <Input type={'text'}
                                               value={axisXMax || ''}
                                               onChange={this.handleValueChange('axisXMax')}/>
                                    </Column>
                                </Columns>
                            </HalfWidth>
                            <HalfWidth>
                                <h4>
                                    {requestTranslation('verticalAxis')}
                                </h4>
                                <Columns>
                                    <Column>
                                        <Label>
                                            {requestTranslation('axisName')}
                                        </Label>
                                        <Input type={'text'}
                                               value={axisYTitle || ''}
                                               onChange={this.handleValueChange('axisYTitle')}/>
                                    </Column>
                                </Columns>
                                <Columns>
                                    <Column>
                                        <Label>
                                            {requestTranslation('lowEnd')}
                                        </Label>
                                        <Input type={'text'}
                                               value={axisYMin || ''}
                                               onChange={this.handleValueChange('axisYMin')}/>
                                    </Column>
                                    <Column>
                                        <Label>
                                            {requestTranslation('highEnd')}
                                        </Label>
                                        <Input type={'text'}
                                               value={axisYMax || ''}
                                               onChange={this.handleValueChange('axisYMax')}/>
                                    </Column>
                                </Columns>
                            </HalfWidth>
                        </SpaceBetween>
                    </FullWidthBgContainer>
                )}
                {ratingsOn && (
                    <FullWidthBgContainer style={{ paddingTop: 0 }}>
                        <h4>
                            {requestTranslation('cornersText')}
                        </h4>
                        <SpaceBetween>
                            <HalfWidth>
                                <Columns>
                                    <Column>
                                        <Label>
                                            {requestTranslation('topLeft')}
                                        </Label>
                                        <Input type={'text'}
                                               value={fourFieldsTopLeft || ''}
                                               onChange={
                                                   this.handleValueChange('fourFieldsTopLeft')
                                               }/>
                                    </Column>
                                    <Column>
                                        <Label>
                                            {requestTranslation('topRight')}
                                        </Label>
                                        <Input type={'text'}
                                               value={fourFieldsTopRight || ''}
                                               onChange={
                                                   this.handleValueChange('fourFieldsTopRight')
                                               }/>
                                    </Column>
                                </Columns>
                                <Columns>
                                    <Column>
                                        <Label>
                                            {requestTranslation('bottomLeft')}
                                        </Label>
                                        <Input type={'text'}
                                               value={fourFieldsBottomLeft || ''}
                                               onChange={
                                                   this.handleValueChange('fourFieldsBottomLeft')
                                               }/>
                                    </Column>
                                    <Column>
                                        <Label>
                                            {requestTranslation('bottomRight')}
                                        </Label>
                                        <Input type={'text'}
                                               value={fourFieldsBottomRight || ''}
                                               onChange={
                                                   this.handleValueChange('fourFieldsBottomRight')
                                               }/>
                                    </Column>
                                </Columns>
                            </HalfWidth>
                        </SpaceBetween>
                    </FullWidthBgContainer>
                )}

                <div className='modal-form-section'>
                    <SpaceBetween>
                        <HalfWidth>
                            <h3>
                                {requestTranslation('commenting')}
                            </h3>
                            <SpaceBetween>
                                <p>
                                    {requestTranslation('createFormCommentingDescription')}
                                </p>
                                <Toggle
                                    icons={false}
                                    defaultChecked={commentsOn}
                                    onChange={this.handleCommentsOnChange}
                                />
                            </SpaceBetween>
                            <SpaceBetween style={{ marginTop: '15px' }}>
                                <p>
                                    {requestTranslation('allowLikeCommenting')}
                                </p>
                                <Toggle icons={false}
                                        defaultChecked={likingOn}
                                        onChange={this.handleLikingOnChange}
                                />
                            </SpaceBetween>
                        </HalfWidth>
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
                    <HalfWidth>
                        <SpaceBetween>
                            <h3 className='mb-0'>
                                {requestTranslation('discussion')}
                            </h3>
                            <Toggle icons={false}
                                    defaultChecked={discussionOn}
                                    onChange={this.handleDiscussionOnChange}
                            />
                        </SpaceBetween>
                    </HalfWidth>
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
