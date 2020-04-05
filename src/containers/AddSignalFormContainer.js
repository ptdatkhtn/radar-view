import { connect } from 'react-redux'
import AddSignalForm from '../components/AddSignalForm'
import { compose, bindActionCreators } from 'redux'
import { createSignal, changeSignalCreateVisibility } from '../actions/signals'

const mapStateToProps = (state) => {
    const {
        loading,
        errors
    } = state

    return {
        loading,
        errors
    }
}

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators({
        createSignal,
        changeSignalCreateVisibility
    }, dispatch)
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(AddSignalForm)
