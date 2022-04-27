import React from 'react'
import _ from 'lodash'
import { Tag } from '@sangre-fp/ui'
import { useSelector } from 'react-redux'
export const PhenomenaTagList = ( {language, phenomena, tagList, editModal, isUpdate}) => {
// eslint-disable-next-line react-hooks/rules-of-hooks
const tags = !!isUpdate ? phenomena?.tags : (editModal?.type === 'EDIT') 
  // eslint-disable-next-line react-hooks/rules-of-hooks
  ? useSelector(state => state?.radarSettings?.storedPhenomenon.tags)
  : []

  console.log('tagsss', tags, tagList)
  const tags2 = (!!editModal && editModal?.type === 'EDIT' && !editModal?.uuid) 
  // eslint-disable-next-line react-hooks/rules-of-hooks
  ? useSelector(state => state?.radarSettings?.storedPhenomenon)
  : phenomena?.tags

  const renderPhenomenaTags = tagList && tagList.length && tags && tags?.length
  const lang = language === 'all' ? document.querySelector('html').getAttribute('lang') || 'en' : language

  if (!renderPhenomenaTags) {
    return null
  }

  return (
    <div className='d-flex flex-row flex-wrap'>
        { renderPhenomenaTags && tags?.map((tagUri, index) => {
          const tagObj = _.find(tagList[0], ({ uri }) => uri === tagUri) || _.find(tagList[1], ({uri }) => uri === tagUri)
          if (!tagObj) {
            return null
          }

          const label = _.isString(tagObj.label) ? tagObj.label : tagObj.label[lang]

          return (
            <Tag key={index} active onClick={null} label={label} small />
          )
        })}
    </div>
  )
}