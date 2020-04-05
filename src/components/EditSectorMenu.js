import React, { PureComponent } from 'react'
import { PopupContainer } from '@sangre-fp/ui'
import styled from 'styled-components'
import { requestTranslation } from '@sangre-fp/i18n'

class EditSectorMenu extends PureComponent {
    render() {
        const {
            x,
            y,
            timeranges,
            addSector,
            onClose,
            sector,
            deleteSector,
            handleEditSectorForm
        } = this.props

        return (
            <PopupContainer onClose={onClose}>
                <EditMenu
                    className='fp-dropdown-menu'
                    style={{
                        left: x,
                        top: y
                    }}
                >
                    {!!timeranges[0].sectors.length &&
                        <EditMenuItem
                            className='fp-dropdown-item'
                            onClick={handleEditSectorForm}
                        >
                            {requestTranslation('editName')}
                        </EditMenuItem>
                    }
                    <EditMenuItem
                        className='fp-dropdown-item'
                        onClick={() => {
                            addSector(0, sector)
                        }}
                    >
                        {requestTranslation('addSectorBefore')}
                    </EditMenuItem>
                    <EditMenuItem
                        className='fp-dropdown-item'
                        onClick={() => addSector(1, sector)}
                    >
                        {requestTranslation('addSectorAfter')}
                    </EditMenuItem>
                    {timeranges[0].sectors.length > 1 &&
                        <EditMenuItem
                            className='fp-dropdown-item'
                            onClick={() => deleteSector(sector)}
                        >
                            {requestTranslation('deleteSector')}
                        </EditMenuItem>
                    }
                </EditMenu>
            </PopupContainer>
        )
    }
}

const EditMenu = styled.div`
    background: white;
    position: absolute;
    opacity: 1;
    width: 230px;
    display: flex;
    flex-direction: column;
    transform: translateX(-50%);
`

const EditMenuItem = styled.div`
    padding: 15px 20px;
    font-size: 16px;
    font-weight: 500;
    color: black;
    box-sizing: border-box;
    z-index: 10;
    &:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.1);
        transition: all 0.4s ease;
    }
`

export default EditSectorMenu
