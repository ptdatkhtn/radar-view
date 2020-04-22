import _ from 'lodash'
import React, { PureComponent } from 'react'
import Text from 'react-svg-text'
import { getPhenomenonUrl } from '../helpers'
import classNames from 'classnames'
import { PhenomenonType } from '@sangre-fp/ui'


export default class Phenomenon extends PureComponent {
    handleDrag = e => {
        // turning off prevent default because it didn't allow phenomena to open on ipad
        // e.preventDefault()
        e.stopPropagation()
        const { onPhenomenaDrag, phenomenon } = this.props
        onPhenomenaDrag(e, phenomenon)
    }

    componentDidMount() {
        const { onPhenomenaDrag } = this.props

        if (onPhenomenaDrag) {
            this.phenomena.addEventListener('mousedown', this.handleDrag)
            this.phenomena.addEventListener('touchstart', this.handleDrag)
            this.phenomena.addEventListener('ontouchstart', this.handleDrag)
        }
    }

    componentWillUnmount() {
        const onPhenomenaDrag = this.props

        if (onPhenomenaDrag) {
            this.phenomena.removeEventListener('mousedown', this.handleDrag)
            this.phenomena.addEventListener('touchstart', this.handleDrag)
            this.phenomena.addEventListener('ontouchstart', this.handleDrag)
        }
    }

    phenomenonRef = ref => {
        this.phenomena = ref
    }

    getPhenomenonType = () => {
        const { phenomenaTypesById, phenomenon: { content: { type: id } } } = this.props

        return phenomenaTypesById[id] || { alias: 'undefined' }
    }

    getClassNameState = () => {
        const { alias } = this.getPhenomenonType()

        return alias
    }

    includesTag = (tags, filter) => {
        let includes = false

        _.map(tags, tag => {
            if (_.includes(filter, tag)) {
                includes = true
            }
        })

        return includes
    }

    getFilterClassName = () => {
        const { alias } = this.getPhenomenonType()
        const { filter, tagFilter, phenomenon: { tags } } = this.props

        if (
            filter
            && filter.length
            && !(_.find(filter, setFilter => setFilter.alias === alias))
        ) {
            return 'phenomenon-disabled'
        }

        if (
            tagFilter
            && tagFilter.length
            && !this.includesTag(tags, tagFilter)
        ) {
            return 'phenomenon-disabled'
        }

        return null
    }

    getClassNameDrag = (dragged, deleting) => {
        if (dragged && deleting) {
            return 'deleting'
        }

        if (dragged) {
            return 'dragged'
        }

        return ''
    }

    render() {
        const {
            deleting,
            labelWidth,
            phenomenaSize,
            cx,
            cy,
            fontSize,
            dragged,
            hidden,
            radarId,
            phenomenon
        } = this.props

        const { content: { title, short_title }, group, halo, speech_bubble } = phenomenon

        // todo change to use project URL
        // eslint-disable-next-line
        const watermarkLink = 'https://go.futuresplatform.com/sites/all/themes/AltFutures_theme/images/watermark-fp.png?v=2'

        let fill
        if (dragged) {
            if (deleting) {
                fill = 'rgba(229, 104, 105, 1)'
            } else {
               fill = 'rgba(43, 201, 143, 0.3)'
            }
        } else {
            fill = 'rgba(43, 201, 143, 1)'
        }

        const radius = phenomenaSize / 2
        const style = {
            fontSize: `${fontSize}px`
        }
        const href = getPhenomenonUrl(radarId, phenomenon)

        const classes = classNames(
            'phenomenon',
            this.getClassNameState(),
            this.getClassNameDrag(dragged, deleting),
            this.getFilterClassName(),
            {
                left: typeof radarId !== 'undefined',
                hidden
            }
        )

        return (
            <g data-href={href}
               ref={this.phenomenonRef}
               className={classes}
            >
                <PhenomenonType phenomenon={phenomenon}
                                type={this.getPhenomenonType().alias}
                                size={phenomenaSize}
                                x={cx}
                                halo={halo}
                                y={cy}
                                fill={fill}/>
                { group === 0 && !deleting &&
                    <image
                        x={cx - radius}
                        y={cy - radius}
                        width={radius * 2}
                        height={radius * 2}
                        xlinkHref={watermarkLink}
                    />
                }
                { deleting &&
                    <foreignObject
                        x={cx - radius}
                        y={cy - radius}
                        width={phenomenaSize}
                        height={phenomenaSize}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div
                            className={'material-icons'}
                            style={{
                                color: 'rgba(255, 255, 255, 0.4)',
                                fontSize: '35px',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            textAnchor={'middle'}
                        >
                            delete
                        </div>
                    </foreignObject>
                }
                <Text textAnchor={'middle'}
                      verticalAnchor={'start'}
                      x={cx}
                      y={cy + (radius * 1.4)}
                      width={labelWidth}
                      className={'phenomena-label noselect'}
                      style={style}>
                    {short_title || title}
                </Text>
            </g>
        )
    }
}
