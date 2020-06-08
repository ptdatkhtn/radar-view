import React, { PureComponent } from 'react'
import styled from 'styled-components'
import ReactQuill from 'react-quill'
import { requestTranslation } from '@sangre-fp/i18n'
import { formats } from '../quill'
import { customQuillModules } from '../config'

export default class SectorEditorForm extends PureComponent {
    state = {
        titleInput: this.props.sector ? this.props.sector.title : '',
        descriptionInput: this.props.sector ? (this.props.sector.notes || '') : ''
    }

    handleTitleChange = ({ target }) => this.setState({ titleInput: target.value })
    handleDescriptionChange = value => this.setState({ descriptionInput: value })

    render() {
        const { titleInput, descriptionInput } = this.state
        const { onClose, updateSector, sector } = this.props

        return (
            <Container>
                <Title>
                    {requestTranslation('editSectorTitle')}
                </Title>
                <SubTitle>
                    {requestTranslation('sectorTitle')}
                </SubTitle>
                <Input
                    type='text'
                    value={titleInput || ''}
                    onChange={this.handleTitleChange}
                />
                <SubTitle>
                    {requestTranslation('sectorDescription')}
                </SubTitle>
                <ReactQuill
                    className='fp-wysiwyg'
                    style={{
                        height: '250px',
                        paddingBottom: '42px'
                    }}
                    value={descriptionInput}
                    onChange={this.handleDescriptionChange}
                    modules={customQuillModules}
                    formats={formats}
                />
                <ButtonsContainer>
                    <button className='btn btn-lg btn-plain-gray' onClick={onClose}>
                        {requestTranslation('cancel')}
                    </button>
                    <button
                        className='btn btn-lg btn-primary'
                        onClick={() =>
                            updateSector(sector, titleInput, descriptionInput, onClose)
                        }
                    >
                        {requestTranslation('save')}
                    </button>
                </ButtonsContainer>
            </Container>
        )
    }
}

const Container = styled.div`
    padding: 30px 50px;
    z-index: 1000;
`

const Title = styled.h2`
    color: black;
    margin: 0;
`

const SubTitle = styled.h3`
    color: black;
    margin-top: 30px;
    margin-bottom: 10px;
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

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
`

