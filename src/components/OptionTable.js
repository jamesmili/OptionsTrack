import React from 'react';
import OptionChain from '../components/OptionChain';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { ToggleButton } from '@material-ui/lab';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { epoch } from '../state/app';

class OptionTable extends React.Component{
    constructor(props){
        super(props); 
        this.state={
            flag: true,
            exprDate: this.props.exprDate
        }
        
    }
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
        const month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
        return(
            <div>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >                    
                    <Grid item>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <ToggleButton
                                    value="color"
                                    selected={this.state.flag}
                                    onChange={() => {this.setState( {flag: true})}}
                                >
                                    Calls
                                </ToggleButton>
                            </Grid>
                            <Grid item>
                                <ToggleButton
                                    value="color"
                                    selected={!this.state.flag}
                                    onChange={() => {this.setState( {flag: false})}}
                                >
                                    Puts
                                </ToggleButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <FormControl variant="outlined">
                            <FormHelperText>Expiration</FormHelperText>
                            <Select native onChange={handleChange} value={this.props.epochVal}>
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
                    this.state.flag?
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
        epochVal: state.app.epoch
    }
}

const mapActionsToProps = dispatch => ({
    epoch: (e) => dispatch(epoch(e))
});

export default connect(mapStateToProps, mapActionsToProps) (OptionTable);