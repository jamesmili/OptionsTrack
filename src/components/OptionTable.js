import React from 'react';
import OptionChain from '../components/OptionChain';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { epoch, callsPuts } from '../state/app';
import { month } from '../constants/const';

class OptionTable extends React.Component{
    render(){
        const handleChange = (event) => {
            const epoch = event.target.value
            this.props.epoch(epoch)
            this.props.updateData(epoch)
        }
        const convertDate = (epoch) => {
            const date = new Date(epoch*1000)
            const expr = month[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getFullYear()
            return expr
        }
        const handleButton = (event, flag) => {
            this.props.callsPuts(flag)
        }
        return(
            <div className="tabs">
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >                    
                    <Grid item>
                        <ToggleButtonGroup
                            size="medium"
                            value={this.props.flag}
                            exclusive
                            onChange={handleButton}>
                            <ToggleButton value={true}>
                                Calls
                            </ToggleButton>
                            <ToggleButton value={false}>
                                Puts
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item>
                        <FormControl variant="outlined">
                            <FormHelperText>Expiration</FormHelperText>
                            <Select native onChange={handleChange} value={this.props.epochVal ? this.props.epochVal : this.props.exprDate[0]}>
                                {
                                    this.props.exprDate.map(expirationDate => {
                                        const expr = convertDate(expirationDate)
                                        return(
                                            <option key={expirationDate} value={expirationDate}>{expr}</option>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {
                    this.props.flag?
                    <OptionChain chain={this.props.calls}/> 
                    :
                    <OptionChain chain={this.props.puts}/> 
                }
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        calls: state.app.calls,
        puts: state.app.puts,
        exprDate: state.app.exprDate,
        epochVal: state.app.epoch,
        flag: state.app.callsPuts
    }
}

const mapActionsToProps = dispatch => ({
    epoch: (e) => dispatch(epoch(e)),
    callsPuts: (b) => dispatch(callsPuts(b))
});

export default connect(mapStateToProps, mapActionsToProps) (OptionTable);