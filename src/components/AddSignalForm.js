import React, { PureComponent } from 'react'
import ReactQuill from 'react-quill'
import styled from 'styled-components'
import { requestTranslation } from '@sangre-fp/i18n'
import { ButtonsContainer, Input, SelectImageButton, SelectImageInput, SelectImageInputContainer, ModalContainer } from '@sangre-fp/ui'
import { customQuillModules } from '../config'
import { formats } from '../quill'


class AddSignalForm extends PureComponent {
    state = {
        title: '',
        body: '',
        image: false,
        imageFile: false,
        imageUrl: false,
        errorsShown: false
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors[0]) {
            this.setState({ errorsShown: true })
        }
    }

    handleTitleChange = ({ target }) => this.setState({ title: target.value })
    handleBodyChange = value => this.setState({ body: value })

    handleImageSelect = (e, file) => {
        const fileName = file || e.target.files[0]
        const reader = new FileReader()

        reader.onload = () => {
            let img = new Image()
            img.src = URL.createObjectURL(fileName)

            img.onload = () => {
                this.setState({
                    image: reader.result,
                    imageFile: fileName
                })
            }
        }
        reader.readAsDataURL(fileName)
    }

    handleCreate = () => {
        const { createSignal, changeSignalCreateVisibility } = this.props
        this.setState({ errorsShown: false })
        createSignal(this.state, changeSignalCreateVisibility)
    }

    render() {
        const { changeSignalCreateVisibility } = this.props
        const { title, body, image, imageUrl, errorsShown } = this.state

        return (
            <ModalContainer className='d-flex flex-column'>
                <h2 className='m-0'>{requestTranslation('addNewSignal')}</h2>
                <div className='mt-3'>
                    <h3>{requestTranslation('title')}</h3>
                    <Input type={'text'} value={title} onChange={this.handleTitleChange} />
                    {errorsShown && !title.length && <div className='description text-danger mt-2'>{requestTranslation('fieldMissing')}</div>}
                </div>
                <div className='mt-3'>
                    <h3>{requestTranslation('mainContent')}</h3>
                    <ReactQuill
                        className='fp-wysiwyg'
                        style={{
                            height: '250px',
                            paddingBottom: '42px'
                        }}
                        modules={customQuillModules}
                        formats={formats}
                        value={body}
                        onChange={this.handleBodyChange}
                    />
                    {errorsShown && !body.length && <div className='description text-danger mt-2'>{requestTranslation('fieldMissing')}</div>}
                </div>
                <div className='mt-3 mb-5'>
                    <h3>{requestTranslation('image')}</h3>
                    {!image && requestTranslation('noImageSelected')}
                    {(image || imageUrl) && <SignalImage src={image || imageUrl} />}
                    <SelectImageInputContainer>
                        <SelectImageInput
                            type='file'
                            accept='image/*'
                            onChange={this.handleImageSelect}
                            placeholder={requestTranslation('select')}
                        />
                        <SelectImageButton className='btn btn-sm btn-outline-secondary'>
                            {requestTranslation('select')}
                        </SelectImageButton>
                    </SelectImageInputContainer>
                </div>
                <ButtonsContainer className='mt-5'>
                    <button
                        className='btn btn-plain'
                        onClick={changeSignalCreateVisibility}
                    >
                        {requestTranslation('cancel')}
                    </button>
                    <button
                        className='btn btn-primary'
                        onClick={this.handleCreate}
                    >
                        {requestTranslation('save')}
                    </button>
                </ButtonsContainer>
            </ModalContainer>
        )
    }
}

export default AddSignalForm

const SignalImage = styled.img`
    max-width: 400px;
    height: auto;
    object-fit: cover;
`
